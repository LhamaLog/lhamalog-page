import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import axios from "axios";
import { validateCatalog } from "./src/features/subscription/catalogo.js";
import {
  decidirAssinatura,
  documentoValido,
  lerEnvLiteral,
  montarPedido,
  urlDoCheckout,
} from "./src/features/subscription/checkout.js";

const ARQUIVO = resolve("public/planos.json");
const LIMITE = 100 * 1024;
const ROTA = "/api/contratacao";

function preencherAmbiente(mode) {
  const lidos = {};
  for (const nome of [".env", ".env.local", `.env.${mode}`, `.env.${mode}.local`]) {
    const caminho = resolve(nome);
    if (!existsSync(caminho)) continue;
    Object.assign(lidos, lerEnvLiteral(readFileSync(caminho, "utf8")));
  }
  for (const nome of ["ASAAS_API_KEY", "ASAAS_BASE_URL"]) {
    if (!process.env[nome] && lidos[nome]) process.env[nome] = lidos[nome];
  }
}

function responder(res, status, corpo) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(corpo));
}

function lerCorpo(req) {
  return new Promise((concluir, falhar) => {
    const partes = [];
    let tamanho = 0;
    req.on("data", (parte) => {
      tamanho += parte.length;
      if (tamanho > LIMITE) {
        falhar(new Error("grande"));
        req.destroy();
        return;
      }
      partes.push(parte);
    });
    req.on("end", () => concluir(Buffer.concat(partes).toString("utf8")));
    req.on("error", falhar);
  });
}

function origemDoPedido(req) {
  const host = String(req.headers.host ?? "");
  const origin = String(req.headers.origin ?? "");
  if (origin && host) {
    try {
      const url = new URL(origin);
      if (url.host === host) return url.origin;
    } catch {
      // origem ilegível: cai no host do pedido
    }
  }
  const encaminhado = String(req.headers["x-forwarded-proto"] ?? "")
    .split(",")[0]
    .trim();
  const esquema = encaminhado === "https" || encaminhado === "http" ? encaminhado : "http";
  return host ? `${esquema}://${host}` : "";
}

function indisponivel(res) {
  responder(res, 503, { disponivel: false });
}

function cabecalhos(chave) {
  return {
    access_token: chave,
    "User-Agent": "LhamaLog-Page",
  };
}

async function consultar(base, chave, caminho, params) {
  const resposta = await axios.get(`${base}${caminho}`, {
    params,
    headers: cabecalhos(chave),
    timeout: 8000,
    validateStatus: () => true,
  });
  if (resposta.status !== 200 || !resposta.data || typeof resposta.data !== "object") return null;
  return resposta.data;
}

async function assinaturasDoCliente(base, chave, customerId) {
  const lista = [];
  let offset = 0;
  for (let pagina = 0; pagina < 5; pagina += 1) {
    const corpo = await consultar(base, chave, "/subscriptions", {
      customer: customerId,
      limit: 100,
      offset,
    });
    if (!corpo) return null;
    const paginaAtual = Array.isArray(corpo.data) ? corpo.data : [];
    lista.push(...paginaAtual);
    if (lista.some((item) => item?.status === "ACTIVE") || !corpo.hasMore) return lista;
    offset += paginaAtual.length || 100;
  }
  return lista;
}

async function contratar(req, res) {
  const chave = String(process.env.ASAAS_API_KEY ?? "").trim();
  const base = String(process.env.ASAAS_BASE_URL ?? "").trim();
  if (!chave || !base || !urlDoCheckout(base, "valido").disponivel) {
    indisponivel(res);
    return;
  }
  let texto;
  try {
    texto = await lerCorpo(req);
  } catch {
    if (!res.writableEnded) indisponivel(res);
    return;
  }
  let corpo;
  try {
    corpo = JSON.parse(texto);
  } catch {
    indisponivel(res);
    return;
  }
  if (!corpo || typeof corpo !== "object" || Array.isArray(corpo)) {
    indisponivel(res);
    return;
  }
  let catalogo;
  try {
    catalogo = JSON.parse(readFileSync(ARQUIVO, "utf8"));
  } catch {
    indisponivel(res);
    return;
  }
  if (!validateCatalog(catalogo).ok) {
    indisponivel(res);
    return;
  }
  const plano = catalogo.planos.find((item) => item && item.codigo === corpo.plano);
  if (!plano) {
    indisponivel(res);
    return;
  }
  const pedido = montarPedido({
    codigo: plano.codigo,
    nome: plano.nome,
    periodo: corpo.periodo,
    centavosCartao: plano.precos?.[corpo.periodo]?.CARTAO,
    origem: origemDoPedido(req),
    agora: new Date(),
  });
  if (!pedido.disponivel) {
    indisponivel(res);
    return;
  }
  if (!documentoValido(corpo.documento)) {
    responder(res, 400, { documentoInvalido: true });
    return;
  }
  let clientes = [];
  let assinaturas = [];
  try {
    const achados = await consultar(base, chave, "/customers", { cpfCnpj: documentoValido(corpo.documento) });
    if (!achados) {
      indisponivel(res);
      return;
    }
    clientes = Array.isArray(achados.data) ? achados.data : [];
    const previa = decidirAssinatura(corpo.documento, clientes, []);
    if (previa.tipo === "existente") {
      const lista = await assinaturasDoCliente(base, chave, previa.customer);
      if (!lista) {
        indisponivel(res);
        return;
      }
      assinaturas = lista;
    }
  } catch {
    indisponivel(res);
    return;
  }
  const decisao = decidirAssinatura(corpo.documento, clientes, assinaturas);
  if (decisao.tipo === "documento") {
    responder(res, 400, { documentoInvalido: true });
    return;
  }
  if (decisao.tipo === "ativa") {
    responder(res, 409, { assinaturaAtiva: true });
    return;
  }
  const corpoAsaas = decisao.tipo === "existente" ? { ...pedido.pedido, customer: decisao.customer } : pedido.pedido;
  let resposta;
  try {
    resposta = await axios.post(`${base}/checkouts`, corpoAsaas, {
      headers: {
        ...cabecalhos(chave),
        "Content-Type": "application/json",
      },
      timeout: 8000,
      validateStatus: () => true,
    });
  } catch {
    indisponivel(res);
    return;
  }
  const endereco = urlDoCheckout(base, resposta?.data?.id);
  if (resposta.status !== 200 || !endereco.disponivel) {
    indisponivel(res);
    return;
  }
  responder(res, 200, { url: endereco.url });
}

function anexar(server) {
  preencherAmbiente(server.config.mode);
  server.middlewares.use((req, res, next) => {
    const caminho = req.url?.split("?")[0];
    if (caminho !== ROTA || req.method !== "POST") return next();
    contratar(req, res).catch(() => {
      if (!res.writableEnded) indisponivel(res);
    });
  });
}

// Checkout de assinatura no processo que serve a página. A chave não entra no pacote do navegador.
export function checkoutPlugin() {
  return {
    name: "checkout-asaas",
    configureServer: anexar,
    configurePreviewServer: anexar,
  };
}
