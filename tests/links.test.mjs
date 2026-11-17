import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as links from "../src/shared/appLinks.js";
import { DEFAULT_APP_URL, signInUrl, signUpUrl } from "../src/shared/appLinks.js";

const APP = "https://app.exemplo.com";

test("Acessar Página e Começar grátis levam ao app (FR-001, FR-010)", () => {
  assert.equal(signInUrl(APP), `${APP}/sign-in`);
  assert.equal(signUpUrl(APP), `${APP}/sign-up`);
  // Sem o app configurado, ficam relativos a este site.
  assert.equal(signUpUrl(""), "/sign-up");
});

test("o endereço padrão do app é https://app.lhamalog.com", () => {
  assert.equal(DEFAULT_APP_URL, "https://app.lhamalog.com");
  // Sem VITE_APP_URL (como no teste e no build sem configuração), os botões usam o padrão.
  assert.equal(signInUrl(), "https://app.lhamalog.com/sign-in");
  assert.equal(signUpUrl(), "https://app.lhamalog.com/sign-up");
});

test("Contratar não monta mais endereço no app", () => {
  assert.equal("contractUrl" in links, false);
});

test("os cartões de plano não informam teste grátis", () => {
  const card = readFileSync(
    new URL("../src/features/subscription/screens/public/PublicPlanCard.jsx", import.meta.url),
    "utf8",
  );
  assert.equal(/teste grátis|teste de 14|testeGratis|isTrialAvailable/i.test(card), false);
});

test("a seção de planos fica entre os recursos e as perguntas (FR-007, T030)", () => {
  const page = readFileSync(new URL("../src/features/landing/LandingPage.jsx", import.meta.url), "utf8");
  const order = ["<PlansSection />", "<Faq />"].map((tag) => page.indexOf(tag));
  assert.ok(order.every((index) => index >= 0));
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
  const section = readFileSync(
    new URL("../src/features/landing/components/PlansSection.jsx", import.meta.url),
    "utf8",
  );
  assert.ok(section.includes('id="planos"') && section.includes("SUPPORT_TEXTS.contratarIndisponivel"));
});
