import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import axios from "axios";
import { loadEnv } from "vite";
import { validateCatalog } from "./src/features/subscription/catalogo.js";
import { montarPedido, urlDoCheckout } from "./src/features/subscription/checkout.js";

const ARQUIVO = resolve("public/planos.json");
const LIMITE = 100 * 1024;
const ROTA = "/api/contratacao";

function preencherAmbiente(mode) {
  const arquivo = loadEnv(mode, process.cwd(), "");
  for (const nome of ["ASAAS_API_KEY", "ASAAS_BASE_URL"]) {
    if (!process.env[nome] && arquivo[nome]) process.env[nome] = arquivo[nome];
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
  let resposta;
  try {
    resposta = await axios.post(`${base}/checkouts`, pedido.pedido, {
      headers: {
        access_token: chave,
        "User-Agent": "LhamaLog-Page",
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
