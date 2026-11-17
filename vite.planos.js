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

function responder(res, status, corpo) {
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

// Gravação do catálogo só no servidor do `npm run dev`, e só para localhost.
export function planosDevPlugin() {
  return {
    name: "planos-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const caminho = req.url?.split("?")[0];
        if (caminho !== "/__dev/planos") return next();
        if (!LOCAIS.has(hostname(req.headers.host)) || req.method !== "POST") {
          responder(res, 404);
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
          writeFileSync(ARQUIVO, `${JSON.stringify(ordenarCatalogo(corpo), null, 2)}\n`);
          responder(res, 200, { ok: true });
        } catch (erro) {
          if (res.writableEnded) return;
          const mensagem = erro?.message === "grande" ? "O catálogo passa de 100 KB." : "Não foi possível ler o catálogo.";
          responder(res, 400, { ok: false, erros: [mensagem] });
        }
      });
    },
  };
}
