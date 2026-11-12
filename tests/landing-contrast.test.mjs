import { test } from "node:test";
import assert from "node:assert/strict";
import { LANDING_CONTRAST_PAIRS } from "../src/features/landing/landingTokens.js";

// Razão de contraste da WCAG 2.1 entre duas cores #RRGGBB.
function luminance(hex) {
  const channels = [1, 3, 5]
    .map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
    .map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

test("todos os pares de cor da landing têm contraste de pelo menos 4,5:1 (FR-014, SC-005)", () => {
  assert.ok(LANDING_CONTRAST_PAIRS.length > 0);
  for (const pair of LANDING_CONTRAST_PAIRS) {
    const ratio = contrast(pair.texto, pair.fundo);
    assert.ok(
      ratio >= 4.5,
      `${pair.nome}: ${pair.texto} sobre ${pair.fundo} = ${ratio.toFixed(2)}:1`,
    );
  }
});

test('o botão principal ("Começar grátis") usa o #0D65D9 da paleta e passa de 5:1, parado e com o mouse em cima (FR-018)', () => {
  for (const name of ["botão principal", "botão principal com mouse em cima"]) {
    const pair = LANDING_CONTRAST_PAIRS.find((item) => item.nome === name);
    assert.ok(pair, `par fora da lista: ${name}`);
    const ratio = contrast(pair.texto, pair.fundo);
    assert.ok(ratio >= 5, `${name}: ${ratio.toFixed(2)}:1`);
  }
  assert.equal(LANDING_CONTRAST_PAIRS.find((item) => item.nome === "botão principal").fundo, "#0D65D9");
});

test("os textos do rodapé escuro e da chamada final estão na lista conferida (FR-014, FR-027)", () => {
  assert.ok(LANDING_CONTRAST_PAIRS.some((pair) => pair.nome.startsWith("rodapé:")));
  assert.ok(LANDING_CONTRAST_PAIRS.some((pair) => pair.nome.startsWith("chamada final")));
});

test("a função de contraste confere valores conhecidos (preto sobre branco = 21:1)", () => {
  assert.ok(Math.abs(contrast("#000000", "#FFFFFF") - 21) < 0.01);
});

// Azul dos botões unificado na paleta da marca (#0D65D9, hover #0B57BD): "Contratar" dos cards de /planos, botões cheios e "Entrar" compacto da landing.
import { readFileSync } from "node:fs";
const plansTokens = readFileSync(
  new URL("../src/features/subscription/screens/public/publicPlansTokens.js", import.meta.url),
  "utf8",
);
const landingTokens = readFileSync(
  new URL("../src/features/landing/landingTokens.js", import.meta.url),
  "utf8",
);

test('"Contratar" de /planos usa o azul #0D65D9 da paleta (hover #0B57BD) (FR-018)', () => {
  const line = (name) => plansTokens.split("\n").find((row) => row.trim().startsWith(`${name}:`));
  for (const name of ["primary", "onDark"]) {
    assert.ok(line(name).includes("bg-[#0D65D9]"), `${name} sem o azul da paleta`);
    assert.ok(line(name).includes("hover:bg-[#0B57BD]"), `${name} sem o hover #0B57BD`);
    assert.ok(!line(name).includes("bg-[#0C70F2]"), `${name} ainda usa o #0C70F2 no fundo`);
  }
  assert.ok(contrast("#FFFFFF", "#0D65D9") >= 5);
  assert.ok(contrast("#FFFFFF", "#0B57BD") >= 5);
});

test('o "Entrar" compacto da landing usa o azul #0D65D9, com contraste de pelo menos 5:1 sobre branco', () => {
  const entrar = landingTokens
    .split("\n")
    .find((row) => row.includes("lg:border-2 lg:border-[#0C70F2]"));
  assert.ok(entrar.includes("text-[#0D65D9]"), "texto do Entrar compacto fora do azul da paleta");
  const pair = LANDING_CONTRAST_PAIRS.find((item) => item.nome.includes('"Entrar" compacto'));
  assert.equal(pair.texto.toUpperCase(), "#0D65D9");
  assert.ok(contrast(pair.texto, pair.fundo) >= 5);
});

test("paleta da marca (FR-018): #0C70F2 nunca é cor de texto sobre #F2F2F2 nem sobre #141826", () => {
  for (const pair of LANDING_CONTRAST_PAIRS) {
    if (pair.texto.toUpperCase() === "#0C70F2") {
      assert.ok(!["#F2F2F2", "#141826"].includes(pair.fundo.toUpperCase()), pair.nome);
    }
  }
  assert.ok(contrast("#0C70F2", "#F2F2F2") < 4.5 && contrast("#0C70F2", "#141826") < 4.5);
});

test("botões animados (FR-025): sobem e afundam só com motion-safe, sem mudar de tamanho", () => {
  const base = landingTokens.split("\n").find((row) => row.includes("motion-safe:hover:-translate-y-0.5") && row.includes("h-12"));
  assert.ok(base, "base dos botões sem a animação");
  assert.ok(base.includes("motion-safe:active:translate-y-px"));
  assert.ok(!/(^|\s)hover:-?translate/.test(base) && !/scale-/.test(base), "movimento fora do motion-safe ou mudança de tamanho");
});
