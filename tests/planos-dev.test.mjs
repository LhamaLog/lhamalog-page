import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import test from "node:test";
import { criarMiddlewarePlanos, planosDevPlugin } from "../vite.planos.js";

const catalogo = readFileSync(new URL("../public/planos.json", import.meta.url), "utf8");

function pedido({ method = "POST", url = "/__dev/planos", host = "localhost:3000", headers = {}, body = "" }) {
  const req = Readable.from([Buffer.from(body)]);
  req.method = method;
  req.url = url;
  req.headers = { host, ...headers };
  return req;
}

function resposta() {
  return {
    statusCode: 0,
    writableEnded: false,
    headers: {},
    setHeader(nome, valor) {
      this.headers[nome] = valor;
    },
    end(corpo) {
      this.body = corpo ?? "";
      this.writableEnded = true;
    },
  };
}

async function chamar(middleware, req) {
  const res = resposta();
  let seguiu = false;
  await middleware(req, res, () => {
    seguiu = true;
  });
  return { res, seguiu };
}

function arquivoTemporario(conteudo = "original\n") {
  const pasta = mkdtempSync(join(tmpdir(), "planos-"));
  const arquivo = join(pasta, "planos.json");
  writeFileSync(arquivo, conteudo);
  return arquivo;
}

test("o plugin não registra a gravação sem LHAMALOG_AJUSTE_PLANOS=1", () => {
  const anterior = process.env.LHAMALOG_AJUSTE_PLANOS;
  delete process.env.LHAMALOG_AJUSTE_PLANOS;
  let registrou = false;
  planosDevPlugin().configureServer({
    middlewares: { use() { registrou = true; } },
  });
  assert.equal(registrou, false);
  if (anterior === undefined) delete process.env.LHAMALOG_AJUSTE_PLANOS;
  else process.env.LHAMALOG_AJUSTE_PLANOS = anterior;
});

test("host de fora e outro método não gravam", async () => {
  const arquivo = arquivoTemporario();
  const middleware = criarMiddlewarePlanos({ arquivo });
  const host = await chamar(middleware, pedido({
    host: "lhamalog.com",
    headers: { "content-type": "application/json" },
    body: catalogo,
  }));
  assert.equal(host.res.statusCode, 404);
  const metodo = await chamar(middleware, pedido({
    method: "GET",
    headers: { "content-type": "application/json" },
  }));
  assert.equal(metodo.res.statusCode, 404);
  assert.equal(readFileSync(arquivo, "utf8"), "original\n");
});

test("recusa conteúdo que não é JSON, JSON inválido e corpo acima de 100 KB sem gravar", async () => {
  const arquivo = arquivoTemporario();
  const middleware = criarMiddlewarePlanos({ arquivo });
  const texto = await chamar(middleware, pedido({
    headers: { "content-type": "text/plain" },
    body: catalogo,
  }));
  assert.equal(texto.res.statusCode, 400);
  const invalido = await chamar(middleware, pedido({
    headers: { "content-type": "application/json" },
    body: "{",
  }));
  assert.equal(invalido.res.statusCode, 400);
  assert.match(invalido.res.body, /não é JSON/);
  const grande = await chamar(middleware, pedido({
    headers: { "content-type": "application/json" },
    body: `{${"a".repeat(100 * 1024)}`,
  }));
  assert.equal(grande.res.statusCode, 400);
  assert.match(grande.res.body, /100 KB/);
  assert.equal(readFileSync(arquivo, "utf8"), "original\n");
});

test("recusa POST vindo de outro site", async () => {
  const arquivo = arquivoTemporario();
  const middleware = criarMiddlewarePlanos({ arquivo });
  const cruzado = await chamar(middleware, pedido({
    headers: {
      "content-type": "application/json",
      origin: "https://evil.example",
      "sec-fetch-site": "cross-site",
    },
    body: catalogo,
  }));
  assert.equal(cruzado.res.statusCode, 403);
  assert.equal(readFileSync(arquivo, "utf8"), "original\n");
});

test("grava o catálogo válido da própria página local", async () => {
  const arquivo = arquivoTemporario();
  const middleware = criarMiddlewarePlanos({ arquivo });
  const salvo = await chamar(middleware, pedido({
    headers: {
      "content-type": "application/json; charset=utf-8",
      origin: "http://localhost:3000",
      "sec-fetch-site": "same-origin",
    },
    body: catalogo,
  }));
  assert.equal(salvo.res.statusCode, 200);
  assert.equal(JSON.parse(readFileSync(arquivo, "utf8")).planos[0].codigo, "FREE");
});

test("o pacote publicado não contém o ajuste", () => {
  const raiz = fileURLToPath(new URL("..", import.meta.url));
  const saida = mkdtempSync(join(tmpdir(), "planos-dist-"));
  execFileSync("npm", ["run", "build", "--", "--outDir", saida, "--emptyOutDir"], {
    cwd: raiz,
    env: { ...process.env, LHAMALOG_AJUSTE_PLANOS: "" },
    stdio: "pipe",
  });
  const textos = [];
  const visitar = (pasta) => {
    for (const nome of readdirSync(pasta)) {
      const caminho = join(pasta, nome);
      if (statSync(caminho).isDirectory()) visitar(caminho);
      else if (/\.(js|html|css)$/.test(nome)) textos.push(readFileSync(caminho, "utf8"));
    }
  };
  visitar(saida);
  const junto = textos.join("\n");
  assert.equal(junto.includes("__dev/planos"), false);
  assert.equal(junto.includes("Ajustar planos"), false);
});
