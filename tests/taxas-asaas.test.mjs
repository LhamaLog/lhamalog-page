import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { TAXA_CARTAO, TAXAS_ASAAS } from "../src/features/subscription/taxasAsaas.js";

const fonte = (caminho) => readFileSync(new URL(`../src/${caminho}`, import.meta.url), "utf8");

test("a taxa do cartão de crédito é a da aba Taxas Asaas", () => {
  assert.equal(
    TAXAS_ASAAS.find((taxa) => taxa.meio === "Cartão de crédito").valor,
    "2,99% + R$ 0,49",
  );
  assert.equal(TAXA_CARTAO, "2,99% + R$ 0,49");
});

test("a taxa do cartão fica antes do preço e a faixa de taxas sai da seção", () => {
  const secao = fonte("features/landing/components/PlansSection.jsx");
  const cartao = fonte("features/subscription/screens/public/PublicPlanCard.jsx");
  assert.ok(!secao.includes("AsaasFees"));
  assert.throws(() => fonte("features/subscription/screens/public/AsaasFees.jsx"));
  const taxa = cartao.indexOf("{TAXA_CARTAO}");
  const preco = cartao.indexOf("<PriceText");
  assert.ok(taxa >= 0 && preco > taxa, "a taxa do cartão precisa vir antes do valor");
  assert.ok(!cartao.includes("Taxa do Pix"));
  assert.ok(!cartao.includes("economiza") && !cartao.includes("line-through") && !cartao.includes("desconto"));
});
