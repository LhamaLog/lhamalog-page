import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { contractUrl, DEFAULT_APP_URL, signInUrl, signUpUrl } from "../src/shared/appLinks.js";
import { isTrialAvailable } from "../src/features/subscription/subscriptionRules.js";

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
  assert.ok(contractUrl("PRO", "MENSAL").startsWith("https://app.lhamalog.com/sign-up?redirect_url="));
});

test("Contratar leva ao cadastro com o plano e a periodicidade no endereço de retorno (FR-010)", () => {
  const url = contractUrl("PRO", "SEMESTRAL", APP);
  assert.ok(url.startsWith(`${APP}/sign-up?redirect_url=`));
  const destino = decodeURIComponent(url.split("redirect_url=")[1]);
  assert.equal(destino, `${APP}/assinatura/contratar?plano=PRO&periodo=SEMESTRAL`);
});

test("Contratar sem app configurado, com endereço inválido ou dado estranho fica indisponível (FR-019)", () => {
  assert.equal(contractUrl("PRO", "MENSAL", ""), null);
  assert.equal(contractUrl("PRO", "MENSAL", "javascript:alert(1)"), null);
  assert.equal(contractUrl("PRO", "MENSAL", "https://app.exemplo.com/caminho"), null);
  assert.equal(contractUrl("PRO", "ANUAL", APP), null);
  assert.equal(contractUrl("pro<script>", "MENSAL", APP), null);
});

test("selo do teste grátis só em Starter ou Pro, mensal, no cartão (FR-022)", () => {
  const pro = { testeGratisDias: 14 };
  const business = { testeGratisDias: null };
  assert.equal(isTrialAvailable(pro, "MENSAL", "CARTAO"), true);
  assert.equal(isTrialAvailable(pro, "SEMANAL", "CARTAO"), false);
  assert.equal(isTrialAvailable(pro, "SEMESTRAL", "CARTAO"), false);
  assert.equal(isTrialAvailable(pro, "MENSAL", "PIX"), false);
  assert.equal(isTrialAvailable(business, "MENSAL", "CARTAO"), false);
  const card = readFileSync(
    new URL("../src/features/subscription/screens/public/PublicPlanCard.jsx", import.meta.url),
    "utf8",
  );
  assert.ok(card.includes('isTrialAvailable(plan, period, "CARTAO")') && card.includes("{trial && ("));
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
