import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  FAQ,
  FEATURES,
  FINAL_CTA,
  FOOTER,
  HERO,
  HOW_IT_WORKS,
  NAV_LINKS,
  OTLP_EXAMPLE_LINES,
  SECTION_IDS,
  SUPPORT_TEXTS,
  LOG_LINES,
} from "../src/features/landing/content.js";
import { LEGAL_LINKS } from "../src/features/landing/legalLinks.js";

// A spec é a fonte dos textos: cada texto da página precisa aparecer nela, letra por letra (T013, FR-002, 004, 005, 008, 009).
const spec = readFileSync(
  new URL("../specs/002-landing-page-publica/spec.md", import.meta.url),
  "utf8",
);
const inSpec = (text) => assert.ok(spec.includes(text), `texto fora da spec: ${text}`);

// Todos os textos da página, menos o exemplo OTLP (que tem marcadores e pode ter dígitos).
function pageStrings() {
  const out = [];
  const walk = (value) => {
    if (typeof value === "string") out.push(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object") Object.values(value).forEach(walk);
  };
  walk([HERO, HOW_IT_WORKS, FEATURES, FAQ, FINAL_CTA, FOOTER, SUPPORT_TEXTS, NAV_LINKS]);
  return out;
}

test("topo: título, subtítulo e linha de oferta iguais à spec (FR-002)", () => {
  inSpec(HERO.titulo);
  inSpec(HERO.subtitulo);
  inSpec(HERO.oferta);
  assert.equal(HERO.oferta, "Plano grátis · Teste de 14 dias nos planos Starter e Pro mensais");
});

test("Como funciona: 3 cards com os textos da spec (FR-004)", () => {
  assert.equal(HOW_IT_WORKS.cards.length, 3);
  for (const card of HOW_IT_WORKS.cards) {
    inSpec(card.titulo);
    inSpec(card.texto);
  }
});

test("recursos: 4 blocos com os textos da spec, alternando o lado da tela (FR-005)", () => {
  assert.equal(FEATURES.length, 4);
  for (const feature of FEATURES) {
    inSpec(feature.titulo);
    inSpec(feature.texto);
  }
  assert.deepEqual(
    FEATURES.map((feature) => feature.invertido),
    [false, true, false, true],
  );
  assert.ok(FEATURES[0].texto.includes("muitas linhas de log"));
  assert.ok(!FEATURES[0].texto.includes("milhares"));
});

test("perguntas frequentes: 5 perguntas e respostas iguais à spec (FR-008)", () => {
  assert.equal(FAQ.length, 5);
  for (const item of FAQ) {
    inSpec(item.pergunta);
    inSpec(item.resposta);
  }
});

test("chamada final igual à spec (FR-009)", () => {
  inSpec(FINAL_CTA.titulo);
  inSpec(FINAL_CTA.frase);
  assert.equal(FINAL_CTA.botao, "Começar grátis");
});

test('textos de apoio aprovados estão na spec, e a mensagem de indisponível traz "Tente novamente mais tarde."', () => {
  for (const text of Object.values(SUPPORT_TEXTS)) inSpec(text);
  assert.ok(SUPPORT_TEXTS.contratarIndisponivel.endsWith("Tente novamente mais tarde."));
});

test("âncoras: os 4 links da barra apontam para ids de seção que existem, sem repetir (FR-001, FR-011)", () => {
  assert.deepEqual(
    NAV_LINKS.map((link) => link.label),
    ["Como funciona", "Recursos", "Planos", "Perguntas"],
  );
  assert.equal(new Set(SECTION_IDS).size, SECTION_IDS.length);
  for (const link of NAV_LINKS)
    assert.ok(SECTION_IDS.includes(link.id), `id sem seção: ${link.id}`);
  assert.equal(new Set(NAV_LINKS.map((link) => link.id)).size, NAV_LINKS.length);
});

test("links legais começam desativados, com endereço nulo (FR-009)", () => {
  assert.deepEqual(LEGAL_LINKS, { termos: null, politica: null });
  assert.ok(!("emBreve" in FOOTER), "o aviso \"em breve\" saiu (2026-11-12)");
  assert.equal(FOOTER.direitos, "© 2026 LhamaLog. Todos os direitos reservados.");
});

test('nenhum número além de "14", nenhum depoimento nem cliente nos textos da página (FR-016, SC-008)', () => {
  for (const text of pageStrings()) {
    const semExcecoes = text.replaceAll("14", "").replace(FOOTER.direitos, "");
    assert.ok(!/\d/.test(semExcecoes), `número inesperado: ${text}`);
    assert.ok(!/depoiment|cliente/i.test(text), `depoimento ou cliente: ${text}`);
  }
});

test("exemplo OTLP usa só marcadores: sem endereço nem token reais (FR-006)", () => {
  const example = OTLP_EXAMPLE_LINES.join("\n");
  assert.ok(example.includes("<ENDEREÇO_DO_LHAMALOG>"));
  assert.ok(example.includes("<TOKEN_DO_PRODUTO>"));
  assert.ok(!/https?:\/\//.test(example));
  assert.ok(!/Bearer (?!<)/.test(example));
});

// Topo com a tela de exemplo da IA (FR-002, FR-013, FR-020): conferido pelo código-fonte, sem biblioteca de teste de componente.
const source = (path) =>
  readFileSync(new URL(`../src/features/landing/${path}`, import.meta.url), "utf8");

test("topo: a tela de exemplo da IA vem depois de título, subtítulo, botões e linha de oferta, na ordem do código (FR-002, FR-013)", () => {
  const hero = source("components/Hero.jsx");
  const order = [
    "HERO.titulo",
    "HERO.subtitulo",
    "HERO.botaoPrincipal",
    "HERO.botaoSecundario",
    "HERO.oferta",
    "<LogStreamMock",
  ].map((marker) => hero.indexOf(marker));
  assert.ok(
    order.every((index) => index >= 0),
    "falta um dos elementos do topo",
  );
  assert.deepEqual(
    order,
    [...order].sort((a, b) => a - b),
    "ordem do código diferente da ordem de leitura",
  );
  assert.ok(
    spec.includes("O topo MUST trazer também a janela animada dos logs"),
    "FR-002 da spec não cita a tela do topo",
  );
});

test("tela da IA: o topo e o bloco 2 usam dados fictícios diferentes, com o mesmo aria-label e a mesma legenda (FR-005, FR-020)", () => {
  const mock = source("components/mocks/aiExamples.js");
  const values = [...mock.matchAll(/^\s+(erro|causa|correcao):\s*"([^"]+)",$/gm)].map(
    (match) => match[1] + "=" + match[2],
  );
  const byField = { erro: [], causa: [], correcao: [] };
  for (const entry of values) {
    const [field, text] = entry.split(/=(.*)/s);
    byField[field].push(text);
  }
  for (const [field, texts] of Object.entries(byField)) {
    assert.equal(texts.length, 2, `esperava 2 exemplos em ${field}`);
    assert.notEqual(texts[0], texts[1], `exemplos iguais em ${field}`);
  }
  assert.ok(source("components/mocks/AiSuggestionMock.jsx").includes("SUPPORT_TEXTS.telaSugestaoIa"));
  assert.ok(source("components/mocks/LogStreamMock.jsx").includes("SUPPORT_TEXTS.telaSugestaoIa"));
  assert.ok(source("components/mocks/LogStreamMock.jsx").includes("AI_EXAMPLES.pedidos"));
  assert.ok(source("components/Hero.jsx").includes("<LogStreamMock />"));
  assert.ok(source("LandingPage.jsx").includes('<AiSuggestionMock example="faturas" />'));
  assert.ok(source("components/mocks/MockFrame.jsx").includes("SUPPORT_TEXTS.legendaTela"));
});

// Integração, perguntas, chamada final e rodapé (T025 a T028): conferidos pelo código-fonte.
test("integração: usa o título e a introdução aprovados e o exemplo OTLP do content.ts, sem copiar texto (FR-006)", () => {
  const code = source("components/IntegrationSection.jsx");
  assert.ok(
    code.includes("SUPPORT_TEXTS.tituloIntegracao") &&
      code.includes("SUPPORT_TEXTS.introIntegracao"),
  );
  assert.ok(code.includes("OTLP_EXAMPLE_LINES.map"));
  assert.ok(/<pre[\s\S]*<code/.test(code), "falta o bloco <pre><code>");
  assert.ok(
    !code.includes("overflow-x"),
    "o código deve quebrar a linha dentro do bloco, sem rolagem lateral",
  );
  assert.ok(!/https?:\/\//.test(code) && !/Bearer/.test(code), "endereço ou token no componente");
});

test('perguntas: <details>/<summary> nativos para as 5 perguntas, id "perguntas", nenhuma aberta no início (FR-008, FR-013)', () => {
  const code = source("components/Faq.jsx");
  assert.ok(
    code.includes('id="perguntas"') && code.includes("<details") && code.includes("<summary"),
  );
  assert.ok(
    code.includes("FAQ.map") && code.includes("item.pergunta") && code.includes("item.resposta"),
  );
  assert.ok(!/<details[^>]*\sopen/.test(code), "uma pergunta nasce aberta");
  assert.ok(
    /motion-safe:transition-transform/.test(code) &&
      !/(^|[\s"`])transition-transform/.test(
        code.replaceAll("motion-safe:transition-transform", ""),
      ),
  );
});

test("chamada final: texto de FINAL_CTA, cadastro e fundo escuro #141826 sem brilhos (FR-009)", () => {
  const code = source("components/FinalCta.jsx");
  assert.ok(
    code.includes("FINAL_CTA.titulo") &&
      code.includes("FINAL_CTA.frase") &&
      code.includes("FINAL_CTA.botao"),
  );
  assert.ok(code.includes("href={signUpUrl()}") && code.includes("bg-[#141826]") && !code.includes("blur-"));
});

test("rodapé: Termos e Política sem endereço viram texto simples, sem \"em breve\"; com endereço, link ativo (FR-009, FR-014)", () => {
  const code = source("components/Footer.jsx");
  assert.ok(code.includes("LEGAL_LINKS.termos") && code.includes("LEGAL_LINKS.politica"));
  assert.ok(!code.includes("emBreve") && !code.includes("aria-disabled"));
  assert.ok(code.includes('target="_blank"') && code.includes('rel="noopener noreferrer"'));
  assert.ok(code.includes("bg-[#141826]") && code.includes("FOOTER.direitos"));
});

test("rodapé: redes num ponto único; só o GitHub tem endereço; sem endereço, ícone com nome para leitor de tela (FR-027)", async () => {
  const { SOCIAL_LINKS } = await import("../src/features/landing/socialLinks.js");
  assert.deepEqual(
    SOCIAL_LINKS.map((item) => item.rede),
    ["GitHub", "LinkedIn", "X", "YouTube", "Instagram", "Facebook"],
  );
  assert.equal(SOCIAL_LINKS.find((item) => item.rede === "GitHub").href, "https://github.com/LhamaLog");
  assert.ok(SOCIAL_LINKS.filter((item) => item.rede !== "GitHub").every((item) => item.href === null));
  const code = source("components/Footer.jsx");
  assert.ok(code.includes('role="img" aria-label={rede}') && code.includes("aria-label={rede}"));
  assert.ok(/h-11 w-auto/.test(code), "logo do rodapé com pelo menos 44 px");
  assert.ok(code.includes("lhamalog-logo-escuro.svg"), "logo do rodapé na versão para fundo escuro");
  assert.equal((code.match(/border-t /g) || []).length, 1, "o rodapé tem uma só linha divisória");
});

test("a página monta integração, perguntas, chamada final e rodapé depois dos recursos (T025 a T028)", () => {
  const page = source("LandingPage.jsx");
  const order = ["<IntegrationSection />", "<Faq />", "<FinalCta />", "<Footer />"].map((tag) =>
    page.indexOf(tag),
  );
  assert.ok(
    order.every((index) => index > page.indexOf("</section>")),
    "seções fora do lugar",
  );
  assert.deepEqual(
    order,
    [...order].sort((a, b) => a - b),
  );
});

// Janela dos logs do topo (FR-023, FR-024, FR-015), conferida pelo código-fonte.
test("janela dos logs: linhas aprovadas na spec, terminando no erro que a IA explica (FR-023)", () => {
  assert.equal(LOG_LINES.length, 6);
  for (const line of LOG_LINES) {
    assert.ok(["INFO", "WARN", "ERROR"].includes(line.nivel));
    inSpec(`${line.nivel} ${line.servico} "${line.mensagem}"`);
  }
  assert.equal(LOG_LINES.at(-1).nivel, "ERROR");
  assert.equal(LOG_LINES.filter((line) => line.nivel === "ERROR").length, 1);
  // Como o exemplo OTLP e as telas de exemplo, são dados fictícios de tela (não entram na checagem de "cliente" dos textos da
  // página, porque "Cliente sem cadastro" é a mensagem do log aprovada), mas também não têm número (FR-016, FR-023).
  for (const line of LOG_LINES) assert.ok(!/\d/.test(Object.values(line).join(" ")), `número na linha: ${line.mensagem}`);
});

test("janela dos logs: botão de pausar com os rótulos aprovados, fora da área lida como imagem, e sem botão com movimento reduzido (FR-024, FR-015)", () => {
  const code = source("components/mocks/LogStreamMock.jsx");
  inSpec(SUPPORT_TEXTS.pausarAnimacao);
  inSpec(SUPPORT_TEXTS.retomarAnimacao);
  assert.ok(code.includes("SUPPORT_TEXTS.pausarAnimacao") && code.includes("SUPPORT_TEXTS.retomarAnimacao"));
  assert.ok(code.includes("prefers-reduced-motion: reduce"));
  assert.ok(code.includes("{!reduced && ("), "o botão deve sumir com movimento reduzido");
  assert.ok(code.lastIndexOf('aria-hidden="true">') < code.indexOf("<button"), "o botão deve ficar fora do conteúdo escondido");
  assert.ok(code.includes("clearTimeout") && code.includes("IntersectionObserver"));
  assert.ok(!/(^|[\s"`])transition-(\[|opacity|colors)/.test(code.replaceAll("motion-safe:transition-", "")), "transição fora do motion-safe");
});
