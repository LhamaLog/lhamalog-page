import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { decidirAssinatura, documentoValido, lerEnvLiteral, montarPedido, urlDoCheckout } from "../src/features/subscription/checkout.js";

const catalogo = JSON.parse(readFileSync(new URL("../public/planos.json", import.meta.url), "utf8"));
const PAGOS = ["STARTER", "PRO", "BUSINESS", "ENTERPRISE"];
const PERIODOS = ["SEMANAL", "MENSAL", "SEMESTRAL"];
const CICLOS = { SEMANAL: "WEEKLY", MENSAL: "MONTHLY", SEMESTRAL: "SEMIANNUALLY" };
const SUFIXOS = { SEMANAL: "semanal", MENSAL: "mensal", SEMESTRAL: "semestral" };
const AGORA = new Date("2026-11-17T15:13:00Z");
const ORIGEM = "https://lhamalog.com";

function plano(codigo) {
  return catalogo.planos.find((item) => item.codigo === codigo);
}

test("as doze combinações usam o preço de cartão, o ciclo e o nome curto", () => {
  for (const codigo of PAGOS) {
    const item = plano(codigo);
    for (const periodo of PERIODOS) {
      const centavos = item.precos[periodo].CARTAO;
      const resultado = montarPedido({
        codigo,
        nome: item.nome,
        periodo,
        centavosCartao: centavos,
        origem: ORIGEM,
        agora: AGORA,
      });
      assert.equal(resultado.disponivel, true, `${codigo} ${periodo}`);
      const { pedido } = resultado;
      assert.deepEqual(pedido.billingTypes, ["CREDIT_CARD"]);
      assert.deepEqual(pedido.chargeTypes, ["RECURRENT"]);
      assert.equal(pedido.minutesToExpire, 60);
      assert.equal(pedido.items.length, 1);
      assert.equal(pedido.items[0].quantity, 1);
      assert.equal(pedido.items[0].value.toFixed(2), (centavos / 100).toFixed(2));
      assert.notEqual(pedido.items[0].value.toFixed(2), (item.precos[periodo].PIX / 100).toFixed(2));
      assert.equal(pedido.subscription.cycle, CICLOS[periodo]);
      assert.equal(pedido.subscription.endDate, undefined);
      assert.equal(pedido.customer, undefined);
      assert.equal(pedido.customerData, undefined);
      assert.equal(pedido.installment, undefined);
      assert.equal(pedido.externalReference, `${codigo}:${periodo}`);
      assert.ok(pedido.externalReference.length <= 200);
      const sufixo = SUFIXOS[periodo];
      assert.ok(pedido.items[0].name.length <= 30);
      assert.ok(pedido.items[0].name.startsWith("Plano "));
      assert.ok(pedido.items[0].name.endsWith(`(${sufixo})`));
      assert.equal(pedido.items[0].description, `LhamaLog - Plano ${item.nome} (${sufixo})`);
      assert.equal(pedido.subscription.nextDueDate, "2026-11-17 12:13:00");
      assert.equal(pedido.callback.successUrl, "https://lhamalog.com/");
      assert.equal(pedido.callback.cancelUrl, "https://lhamalog.com/");
      assert.equal(pedido.callback.expiredUrl, "https://lhamalog.com/");
    }
  }
});

test("nome longo é cortado no item e a descrição fica inteira", () => {
  const resultado = montarPedido({
    codigo: "PRO",
    nome: "Supercalifragilistico",
    periodo: "MENSAL",
    centavosCartao: 41181,
    origem: ORIGEM,
    agora: AGORA,
  });
  assert.equal(resultado.disponivel, true);
  assert.equal(resultado.pedido.items[0].name, "Plano Supercalifragil (mensal)");
  assert.equal(resultado.pedido.items[0].name.length, 30);
  assert.equal(
    resultado.pedido.items[0].description,
    "LhamaLog - Plano Supercalifragilistico (mensal)",
  );
});

test("o endereço segue o ambiente e só aceita id seguro", () => {
  assert.deepEqual(urlDoCheckout("https://api-sandbox.asaas.com/v3", "abc-123"), {
    disponivel: true,
    url: "https://sandbox.asaas.com/checkoutSession/show?id=abc-123",
  });
  assert.deepEqual(urlDoCheckout("https://api.asaas.com/v3", "abc-123"), {
    disponivel: true,
    url: "https://asaas.com/checkoutSession/show?id=abc-123",
  });
  for (const base of ["https://evil.example/v3", "https://api-sandbox.asaas.com/v3/", "https://api.asaas.com/v3/"]) {
    assert.equal(urlDoCheckout(base, "abc-123").disponivel, false);
  }
  for (const id of ["", "a/b", "a?b", "a&b"]) {
    assert.equal(urlDoCheckout("https://api-sandbox.asaas.com/v3", id).disponivel, false);
  }
});

test("CPF e CNPJ válidos seguem; repetidos e curtos não", () => {
  assert.equal(documentoValido("390.533.447-05"), "39053344705");
  assert.equal(documentoValido("11.222.333/0001-81"), "11222333000181");
  assert.equal(documentoValido("111.111.111-11"), null);
  assert.equal(documentoValido("123"), null);
  assert.equal(documentoValido(""), null);
});

test("assinatura ativa impede outro checkout e cliente sem assinatura é reutilizado", () => {
  const clientes = [{ id: "cus_1", cpfCnpj: "39053344705" }];
  assert.deepEqual(decidirAssinatura("390.533.447-05", [], []), { tipo: "novo", documento: "39053344705" });
  assert.equal(decidirAssinatura("123", clientes, []).tipo, "documento");
  assert.deepEqual(decidirAssinatura("39053344705", clientes, [{ status: "INACTIVE" }]), {
    tipo: "existente",
    documento: "39053344705",
    customer: "cus_1",
  });
  assert.deepEqual(decidirAssinatura("39053344705", clientes, [{ status: "ACTIVE" }]), { tipo: "ativa" });
});

test("o retorno em localhost vira 127.0.0.1, que o Asaas aceita", () => {
  const resultado = montarPedido({
    codigo: "PRO",
    nome: "Pro",
    periodo: "MENSAL",
    centavosCartao: 41181,
    origem: "http://localhost:3000",
    agora: AGORA,
  });
  assert.equal(resultado.disponivel, true);
  assert.equal(resultado.pedido.callback.successUrl, "http://127.0.0.1:3000/");
  assert.equal(resultado.pedido.callback.cancelUrl, "http://127.0.0.1:3000/");
  assert.equal(resultado.pedido.callback.expiredUrl, "http://127.0.0.1:3000/");
});

test("a chave do Asaas que começa com $ permanece inteira", () => {
  const vars = lerEnvLiteral("# comentario\nASAAS_API_KEY=$aact_hmlg_abc\nASAAS_BASE_URL=https://api-sandbox.asaas.com/v3\n");
  assert.equal(vars.ASAAS_API_KEY, "$aact_hmlg_abc");
  assert.equal(vars.ASAAS_BASE_URL, "https://api-sandbox.asaas.com/v3");
  assert.equal(lerEnvLiteral('ASAAS_API_KEY="\\$aact_hmlg_xyz"').ASAAS_API_KEY, "$aact_hmlg_xyz");
});

test("plano grátis, período estranho, preço inválido ou nome vazio não montam pedido", () => {
  const base = { nome: "Pro", periodo: "MENSAL", centavosCartao: 41181, origem: ORIGEM, agora: AGORA };
  assert.equal(montarPedido({ ...base, codigo: "FREE" }).disponivel, false);
  assert.equal(montarPedido({ ...base, codigo: "PRO", periodo: "ANUAL" }).disponivel, false);
  assert.equal(montarPedido({ ...base, codigo: "PRO", centavosCartao: null }).disponivel, false);
  assert.equal(montarPedido({ ...base, codigo: "PRO", centavosCartao: 0 }).disponivel, false);
  assert.equal(montarPedido({ ...base, codigo: "PRO", centavosCartao: -1 }).disponivel, false);
  assert.equal(montarPedido({ ...base, codigo: "PRO", nome: "" }).disponivel, false);
  assert.equal(montarPedido({ ...base, codigo: "PRO", nome: "   " }).disponivel, false);
});
