import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { TAXAS_ASAAS, TAXAS_ASAAS_NOTA, TAXAS_ASAAS_TITULO } from "../src/features/subscription/taxasAsaas.js";

const fonte = (caminho) => readFileSync(new URL(`../src/${caminho}`, import.meta.url), "utf8");

test("as taxas do Asaas são as da aba Taxas Asaas, sem promoção", () => {
  assert.deepEqual(TAXAS_ASAAS, [
    { meio: "Pix", valor: "R$ 1,99" },
    { meio: "Cartão de crédito", valor: "2,99% + R$ 0,49" },
    { meio: "Cartão de débito", valor: "1,89% + R$ 0,35" },
  ]);
  assert.equal(TAXAS_ASAAS_TITULO, "Taxas do Asaas");
  assert.match(TAXAS_ASAAS_NOTA, /já inclui a taxa do Pix/);
  assert.ok(!/desconto/i.test(TAXAS_ASAAS_NOTA));
});

test("a seção de planos mostra as taxas em faixa horizontal e não mostra desconto", () => {
  const catalogo = fonte("features/subscription/screens/public/PlansCatalog.jsx");
  const secao = fonte("features/landing/components/PlansSection.jsx");
  const cartao = fonte("features/subscription/screens/public/PublicPlanCard.jsx");
  const quadro = fonte("features/subscription/screens/public/AsaasFees.jsx");
  const faixa = secao.slice(secao.indexOf("wideContainer"), secao.indexOf("<AsaasFees") + "<AsaasFees".length);
  assert.ok(faixa.includes("<PlansCatalog") && faixa.includes("<AsaasFees"));
  assert.ok(!catalogo.includes("AsaasFees"));
  assert.ok(!catalogo.includes("desconto"));
  assert.ok(!catalogo.includes("hints"));
  assert.ok(quadro.includes('className="w-full border-y'));
  assert.ok(quadro.includes("grid w-full grid-cols-3"));
  assert.ok(quadro.includes("TAXAS_ASAAS") && quadro.includes("TAXAS_ASAAS_TITULO"));
  assert.ok(cartao.includes("Taxa do Pix:"));
  assert.ok(!cartao.includes("economiza") && !cartao.includes("line-through") && !cartao.includes("desconto"));
});
