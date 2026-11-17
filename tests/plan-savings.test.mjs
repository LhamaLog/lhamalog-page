import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";
import { maxSemestralDiscountPercent, semestralSavings } from "../src/features/subscription/format.js";

test("o desconto do semestral é a diferença real para 6 mensalidades no Pix", () => {
  const plans = JSON.parse(readFileSync(new URL("../public/planos.json", import.meta.url), "utf8")).planos;
  assert.equal(semestralSavings(plans.find((plan) => plan.codigo === "FREE")), null);
  for (const plan of plans.filter((plan) => plan.precos)) {
    const savings = semestralSavings(plan);
    assert.equal(savings.full, plan.precos.MENSAL.PIX * 6);
    assert.equal(savings.saved, savings.full - plan.precos.SEMESTRAL.PIX);
    assert.ok(savings.saved > 0);
  }
  const starter = semestralSavings(plans.find((plan) => plan.codigo === "STARTER"));
  assert.equal(starter.saved, 995);
  assert.equal(starter.percent, 2);
  assert.equal(maxSemestralDiscountPercent(plans), 2);
  assert.equal(semestralSavings(plans.find((plan) => plan.codigo === "PRO")).percent, 0);
});
