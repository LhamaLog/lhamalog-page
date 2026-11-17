import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Readable } from "node:stream";
import test from "node:test";
import { criarMiddlewareContratacao } from "../vite.checkout.js";
import { criarTravaClique, destinoContratacao } from "../src/features/subscription/checkout.js";

const catalogo = readFileSync(new URL("../public/planos.json", import.meta.url), "utf8");
const env = { ASAAS_API_KEY: "$aact_hmlg_teste", ASAAS_BASE_URL: "https://api-sandbox.asaas.com/v3" };

function pedido({ method = "POST", url = "/api/contratacao", host = "localhost:3000", headers = {}, body = "", ip = "127.0.0.1" }) {
  const req = Readable.from([Buffer.from(body)]);
  req.method = method;
  req.url = url;
  req.headers = { host, ...headers };
  req.socket = { remoteAddress: ip };
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
  return { res, seguiu, json: res.body ? JSON.parse(res.body) : null };
}

function middleware(extra = {}) {
  const chamadas = [];
  const registros = [];
  const rota = criarMiddlewareContratacao({
    lerCatalogo: async () => catalogo,
    postCheckout: async (corpo) => {
      chamadas.push(corpo);
      return { status: 200, data: { id: "abc-123" } };
    },
    env,
    agora: () => new Date("2026-11-17T15:13:00Z"),
    registrar: (resultado, ip) => registros.push({ resultado, ip }),
    ...extra,
  });
  return { rota, chamadas, registros };
}

const json = {
  "content-type": "application/json",
  origin: "http://localhost:3000",
  "sec-fetch-site": "same-origin",
};

test("GET na rota de contratação segue adiante e não cria checkout", async () => {
  const { rota, chamadas } = middleware();
  const resultado = await chamar(rota, pedido({ method: "GET", headers: json }));
  assert.equal(resultado.seguiu, true);
  assert.equal(chamadas.length, 0);
});

test("sem chave, plano inválido ou período estranho respondem 503 e não chamam o Asaas", async () => {
  const semChave = middleware({ env: {} });
  const falta = await chamar(semChave.rota, pedido({ headers: json, body: '{"plano":"PRO","periodo":"MENSAL"}' }));
  assert.equal(falta.res.statusCode, 503);
  assert.deepEqual(falta.json, { disponivel: false });
  assert.equal(semChave.chamadas.length, 0);

  const { rota, chamadas } = middleware();
  const plano = await chamar(rota, pedido({ headers: json, body: '{"plano":"FREE","periodo":"MENSAL"}' }));
  const periodo = await chamar(rota, pedido({ headers: json, body: '{"plano":"PRO","periodo":"ANUAL"}', ip: "10.0.0.2" }));
  assert.equal(plano.res.statusCode, 503);
  assert.equal(periodo.res.statusCode, 503);
  assert.equal(chamadas.length, 0);
});

test("o preço enviado pelo navegador é ignorado", async () => {
  const { rota, chamadas } = middleware();
  const resultado = await chamar(rota, pedido({
    headers: json,
    body: '{"plano":"PRO","periodo":"MENSAL","value":1}',
  }));
  assert.equal(resultado.res.statusCode, 200);
  assert.equal(resultado.json.url, "https://sandbox.asaas.com/checkoutSession/show?id=abc-123");
  assert.equal(chamadas[0].items[0].value, 411.81);
  assert.equal(chamadas[0].externalReference, "PRO:MENSAL");
});

test("Asaas com erro, sem id ou timeout responde 503", async () => {
  const erro = middleware({ postCheckout: async () => ({ status: 500, data: {} }) });
  const semId = middleware({ postCheckout: async () => ({ status: 200, data: {} }) });
  const timeout = middleware({
    postCheckout: async () => {
      throw new Error("timeout");
    },
  });
  const a = await chamar(erro.rota, pedido({ headers: json, body: '{"plano":"PRO","periodo":"MENSAL"}', ip: "10.0.0.3" }));
  const b = await chamar(semId.rota, pedido({ headers: json, body: '{"plano":"PRO","periodo":"MENSAL"}', ip: "10.0.0.4" }));
  const c = await chamar(timeout.rota, pedido({ headers: json, body: '{"plano":"PRO","periodo":"MENSAL"}', ip: "10.0.0.5" }));
  assert.equal(a.res.statusCode, 503);
  assert.equal(b.res.statusCode, 503);
  assert.equal(c.res.statusCode, 503);
  assert.equal(erro.registros.some((item) => item.resultado === "asaas"), true);
  assert.equal(JSON.stringify(erro.registros).includes("$aact"), false);
});

test("corpo acima de 100 KB não chama o Asaas", async () => {
  const { rota, chamadas } = middleware();
  const resultado = await chamar(rota, pedido({
    headers: json,
    body: `{"plano":"PRO","periodo":"MENSAL","lixo":"${"a".repeat(110 * 1024)}"}`,
    ip: "10.0.0.6",
  }));
  assert.equal(resultado.res.statusCode, 503);
  assert.equal(chamadas.length, 0);
});

test("outro site e conteúdo que não é JSON são recusados", async () => {
  const { rota, chamadas } = middleware();
  const tipo = await chamar(rota, pedido({
    headers: { origin: "http://localhost:3000" },
    body: '{"plano":"PRO","periodo":"MENSAL"}',
    ip: "10.0.0.7",
  }));
  const site = await chamar(rota, pedido({
    headers: { ...json, "sec-fetch-site": "cross-site" },
    body: '{"plano":"PRO","periodo":"MENSAL"}',
    ip: "10.0.0.8",
  }));
  const origem = await chamar(rota, pedido({
    headers: { ...json, origin: "https://evil.example" },
    body: '{"plano":"PRO","periodo":"MENSAL"}',
    ip: "10.0.0.9",
  }));
  assert.equal(tipo.res.statusCode, 415);
  assert.equal(site.res.statusCode, 403);
  assert.equal(origem.res.statusCode, 403);
  assert.equal(chamadas.length, 0);
});

test("atrás de um proxy privado o limite usa o último X-Forwarded-For, e um socket público ignora o cabeçalho", async () => {
  const { rota, chamadas } = middleware({ limitePorIp: 1 });
  const corpo = '{"plano":"PRO","periodo":"MENSAL"}';
  const cabecalhos = {
    ...json,
    "x-forwarded-for": "1.1.1.1, 203.0.113.10",
  };
  const primeiro = await chamar(rota, pedido({
    headers: cabecalhos,
    body: corpo,
    ip: "10.8.0.4",
  }));
  const segundo = await chamar(rota, pedido({
    headers: { ...cabecalhos, "x-forwarded-for": "9.9.9.9, 203.0.113.11" },
    body: corpo,
    ip: "10.8.0.4",
  }));
  const direto = await chamar(rota, pedido({
    headers: { ...json, "x-forwarded-for": "1.1.1.1" },
    body: corpo,
    ip: "203.0.113.40",
  }));
  const repetido = await chamar(rota, pedido({
    headers: { ...json, "x-forwarded-for": "8.8.8.8" },
    body: corpo,
    ip: "203.0.113.40",
  }));
  assert.equal(primeiro.res.statusCode, 200);
  assert.equal(segundo.res.statusCode, 200);
  assert.equal(direto.res.statusCode, 200);
  assert.equal(repetido.res.statusCode, 429);
  assert.equal(chamadas.length, 3);
});

test("sandbox em host público não abre checkout", async () => {
  const { rota, chamadas } = middleware();
  const resultado = await chamar(rota, pedido({
    host: "lhamalog.com",
    headers: {
      "content-type": "application/json",
      origin: "https://lhamalog.com",
      "sec-fetch-site": "same-origin",
    },
    body: '{"plano":"PRO","periodo":"MENSAL"}',
    ip: "203.0.113.20",
  }));
  assert.equal(resultado.res.statusCode, 503);
  assert.equal(chamadas.length, 0);
});

test("o limite por IP responde 429 e não chama o Asaas de novo", async () => {
  const { rota, chamadas } = middleware({ limitePorIp: 1 });
  const corpo = '{"plano":"PRO","periodo":"MENSAL"}';
  const primeiro = await chamar(rota, pedido({ headers: json, body: corpo, ip: "10.1.0.1" }));
  const segundo = await chamar(rota, pedido({ headers: json, body: corpo, ip: "10.1.0.1" }));
  assert.equal(primeiro.res.statusCode, 200);
  assert.equal(segundo.res.statusCode, 429);
  assert.equal(chamadas.length, 1);
});

test("a página só navega para o checkout do Asaas e a trava segura o segundo clique", () => {
  assert.deepEqual(destinoContratacao(200, { url: "https://sandbox.asaas.com/checkoutSession/show?id=abc" }), {
    tipo: "navegar",
    url: "https://sandbox.asaas.com/checkoutSession/show?id=abc",
  });
  assert.equal(destinoContratacao(503, { disponivel: false }).tipo, "indisponivel");
  assert.equal(destinoContratacao(200, { url: "https://evil.example/checkout" }).tipo, "indisponivel");
  const trava = criarTravaClique();
  assert.equal(trava.ocupar(), true);
  assert.equal(trava.ocupar(), false);
  trava.liberar();
  assert.equal(trava.ocupar(), true);
});
