import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ordenarCatalogo, validateCatalog } from "./src/features/subscription/catalogo.js";

const ARQUIVO = resolve("public/planos.json");
const LIMITE = 100 * 1024;
const LOCAIS = new Set(["localhost", "127.0.0.1", "::1"]);

function hostname(host) {
  const valor = String(host ?? "");
  if (valor.startsWith("[")) {
    const fim = valor.indexOf("]");
    return fim > 1 ? valor.slice(1, fim) : "";
  }
  return valor.replace(/:\d+$/, "");
}

function hostLocal(host) {
  return LOCAIS.has(hostname(host));
}

function tipoJson(valor) {
  return String(valor ?? "").toLowerCase().split(";")[0].trim() === "application/json";
}

function hostDaOrigem(origem) {
  try {
    return hostname(new URL(origem).host);
  } catch {
    return "";
  }
}

function responder(res, status, corpo) {
  if (res.writableEnded) return;
  res.statusCode = status;
  if (!corpo) {
    res.end();
    return;
  }
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

// Tratamento de POST /__dev/planos. O plugin só o registra com LHAMALOG_AJUSTE_PLANOS=1.
export function criarMiddlewarePlanos({ arquivo }) {
  return async (req, res, next) => {
    const caminho = req.url?.split("?")[0];
    if (caminho !== "/__dev/planos") return next();
    if (!hostLocal(req.headers.host) || req.method !== "POST") {
      responder(res, 404);
      return;
    }
    if (!tipoJson(req.headers["content-type"])) {
      responder(res, 400, { ok: false, erros: ["O conteúdo precisa ser JSON."] });
      return;
    }
    const site = String(req.headers["sec-fetch-site"] ?? "");
    if (site && site !== "same-origin") {
      responder(res, 403, { ok: false, erros: ["A gravação só aceita a própria página local."] });
      return;
    }
    const origem = req.headers.origin;
    if (origem !== undefined && !hostLocal(hostDaOrigem(origem))) {
      responder(res, 403, { ok: false, erros: ["A gravação só aceita a própria página local."] });
      return;
    }
    try {
      const texto = await lerCorpo(req);
      let corpo;
      try {
        corpo = JSON.parse(texto);
      } catch {
        responder(res, 400, { ok: false, erros: ["O corpo não é JSON."] });
        return;
      }
      const resultado = validateCatalog(corpo);
      if (!resultado.ok) {
        responder(res, 400, { ok: false, erros: resultado.erros });
        return;
      }
      writeFileSync(arquivo, `${JSON.stringify(ordenarCatalogo(corpo), null, 2)}\n`);
      responder(res, 200, { ok: true });
    } catch (erro) {
      if (res.writableEnded) return;
      const mensagem = erro?.message === "grande" ? "O catálogo passa de 100 KB." : "Não foi possível ler o catálogo.";
      responder(res, 400, { ok: false, erros: [mensagem] });
    }
  };
}

export function planosDevPlugin() {
  return {
    name: "planos-dev",
    configureServer(server) {
      if (process.env.LHAMALOG_AJUSTE_PLANOS !== "1") return;
      server.middlewares.use(criarMiddlewarePlanos({ arquivo: ARQUIVO }));
    },
  };
}
