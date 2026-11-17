import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import axios from "axios";
import { validateCatalog } from "./src/features/subscription/catalogo.js";
import {
  ipDoPedido,
  lerEnvLiteral,
  montarPedido,
  sandboxRecusado,
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
  for (const nome of ["ASAAS_API_KEY", "ASAAS_BASE_URL", "ASAAS_AMBIENTE"]) {
    if (!process.env[nome] && lidos[nome]) process.env[nome] = lidos[nome];
  }
}

function responder(res, status, corpo) {
  if (res.writableEnded) return;
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(corpo));
}

function tipoJson(valor) {
  return String(valor ?? "").toLowerCase().split(";")[0].trim() === "application/json";
}

function hostname(host) {
  const valor = String(host ?? "");
  if (valor.startsWith("[")) {
    const fim = valor.indexOf("]");
    return fim > 1 ? valor.slice(1, fim) : "";
  }
  return valor.replace(/:\d+$/, "");
}

function ipDe(req, env) {
  return ipDoPedido(req.socket?.remoteAddress, req.headers?.["x-forwarded-for"], env.CONTRATACAO_PROXIES);
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

const JANELA_MS = 60_000;
const LIMITE_PADRAO = 10;

// POST /api/contratacao. A chave fica no processo; o navegador só recebe a URL do Asaas.
export function criarMiddlewareContratacao({
  lerCatalogo,
  postCheckout,
  agora = () => new Date(),
  env = process.env,
  limitePorIp = LIMITE_PADRAO,
  registrar = (resultado, ip) => {
    console.info(`[contratacao] ${resultado} ip=${ip}`);
  },
} = {}) {
  const tentativas = new Map();
  return async (req, res, next) => {
    const caminho = req.url?.split("?")[0];
    if (caminho !== ROTA || req.method !== "POST") return next();
    const ip = ipDe(req, env);
    const recusar = (status, corpo, resultado) => {
      registrar(resultado, ip);
      responder(res, status, corpo);
    };
    if (!tipoJson(req.headers["content-type"])) {
      recusar(415, { disponivel: false }, "tipo");
      return;
    }
    const site = String(req.headers["sec-fetch-site"] ?? "");
    if (site && site !== "same-origin") {
      recusar(403, { disponivel: false }, "site");
      return;
    }
    const origem = req.headers.origin;
    if (origem !== undefined && hostname(hostDaOrigem(origem)) !== hostname(req.headers.host)) {
      recusar(403, { disponivel: false }, "origem");
      return;
    }
    const instante = agora().getTime();
    for (const [chave, marcas] of tentativas) {
      const vivas = marcas.filter((marca) => instante - marca < JANELA_MS);
      if (vivas.length === 0) tentativas.delete(chave);
      else tentativas.set(chave, vivas);
    }
    const recentes = tentativas.get(ip) || [];
    if (recentes.length >= limitePorIp) {
      tentativas.set(ip, recentes);
      recusar(429, { disponivel: false }, "limite");
      return;
    }
    recentes.push(instante);
    tentativas.set(ip, recentes);
    try {
      await contratar(req, res, { lerCatalogo, postCheckout, agora, env, registrar, ip });
    } catch {
      if (!res.writableEnded) {
        registrar("falha", ip);
        indisponivel(res);
      }
    }
  };
}

function hostDaOrigem(origem) {
  try {
    return new URL(origem).host;
  } catch {
    return "";
  }
}

async function contratar(req, res, { lerCatalogo, postCheckout, agora, env, registrar, ip }) {
  const chave = String(env.ASAAS_API_KEY ?? "").trim();
  const base = String(env.ASAAS_BASE_URL ?? "").trim();
  if (!chave || !base || !urlDoCheckout(base, "valido").disponivel) {
    registrar("sem-acesso", ip);
    indisponivel(res);
    return;
  }
  if (sandboxRecusado(base, env.ASAAS_AMBIENTE)) {
    registrar("sandbox-recusado", ip);
    indisponivel(res);
    return;
  }
  let texto;
  try {
    texto = await lerCorpo(req);
  } catch {
    if (!res.writableEnded) {
      registrar("corpo", ip);
      indisponivel(res);
    }
    return;
  }
  let corpo;
  try {
    corpo = JSON.parse(texto);
  } catch {
    registrar("corpo", ip);
    indisponivel(res);
    return;
  }
  if (!corpo || typeof corpo !== "object" || Array.isArray(corpo)) {
    registrar("corpo", ip);
    indisponivel(res);
    return;
  }
  let catalogo;
  try {
    catalogo = JSON.parse(await lerCatalogo());
  } catch {
    registrar("catalogo", ip);
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
    agora: agora(),
  });
  if (!pedido.disponivel) {
    registrar("recusado", ip);
    indisponivel(res);
    return;
  }
  let resposta;
  try {
    resposta = await postCheckout(pedido.pedido, { chave, base });
  } catch {
    registrar("asaas", ip);
    indisponivel(res);
    return;
  }
  const endereco = urlDoCheckout(base, resposta?.data?.id);
  if (resposta.status !== 200 || !endereco.disponivel) {
    registrar("asaas", ip);
    indisponivel(res);
    return;
  }
  registrar("aberto", ip);
  responder(res, 200, { url: endereco.url });
}

async function postCheckoutPadrao(pedido, { chave, base }) {
  return axios.post(`${base}/checkouts`, pedido, {
    headers: {
      access_token: chave,
      "User-Agent": "LhamaLog-Page",
      "Content-Type": "application/json",
    },
    timeout: 8000,
    validateStatus: () => true,
  });
}

function anexar(server) {
  preencherAmbiente(server.config.mode);
  server.middlewares.use(criarMiddlewareContratacao({
    lerCatalogo: () => readFileSync(ARQUIVO, "utf8"),
    postCheckout: postCheckoutPadrao,
  }));
}

// Checkout de assinatura no processo que serve a página. A chave não entra no pacote do navegador.
export function checkoutPlugin() {
  return {
    name: "checkout-asaas",
    configureServer: anexar,
    configurePreviewServer: anexar,
  };
}
