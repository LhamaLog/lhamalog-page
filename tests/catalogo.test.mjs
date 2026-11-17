import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { ordenarCatalogo, reaisParaCentavos, validateCatalog } from "../src/features/subscription/catalogo.js";

function meios(pix, cartao, debito) {
  return { PIX: pix, BOLETO: pix, CARTAO: cartao, DEBITO: debito };
}
function precos(pix, cartao, debito) {
  return {
    SEMANAL: meios(pix, cartao, debito),
    MENSAL: meios(pix + 10, cartao + 10, debito + 10),
    SEMESTRAL: meios(pix + 20, cartao + 20, debito + 20),
  };
}
function plano(codigo, gratis) {
  return {
    codigo,
    nome: codigo,
    descricao: `Descrição ${codigo}`,
    selo: gratis ? "Para começar" : "Selo",
    recomendado: codigo === "PRO",
    precos: gratis ? null : precos(100, 110, 105),
    franquiaGb: 1,
    franquiaPor: { SEMANAL: gratis ? "MES" : "SEMANA", MENSAL: "MES", SEMESTRAL: "MES" },
    precoGbExcedenteCentavos: gratis ? null : meios(10, 11, 11),
    precoArmazenamentoExtraCentavos: gratis ? null : meios(10, 11, 11),
    retencaoDias: 7,
    dashboard: "BASICO",
    recursosAnalise: [],
    chamadasIaMes: 10,
    membrosIncluidos: 1,
    produtosIncluidos: 1,
  };
}
function catalogoValido() {
  return {
    moeda: "BRL",
    planos: ["FREE", "STARTER", "PRO", "BUSINESS", "ENTERPRISE"].map((codigo) => plano(codigo, codigo === "FREE")),
  };
}
function recusa(alterar, trecho) {
  const catalogo = catalogoValido();
  alterar(catalogo);
  const resultado = validateCatalog(catalogo);
  assert.equal(resultado.ok, false, trecho);
  assert.ok(resultado.erros.some((erro) => erro.toLowerCase().includes(trecho.toLowerCase())), resultado.erros.join(" | "));
}

test("aceita um catálogo válido e não altera o objeto", () => {
  const catalogo = catalogoValido();
  const antes = structuredClone(catalogo);
  const resultado = validateCatalog(catalogo);
  assert.deepEqual(resultado, { ok: true, erros: [] });
  assert.deepEqual(catalogo, antes);
});

test("aceita o arquivo público de planos", () => {
  const arquivo = JSON.parse(readFileSync(new URL("../public/planos.json", import.meta.url), "utf8"));
  assert.equal(validateCatalog(arquivo).ok, true);
  assert.equal(arquivo.moeda, "BRL");
  assert.equal(arquivo.atual, undefined);
  assert.deepEqual(
    arquivo.planos.map((item) => item.codigo),
    ["FREE", "STARTER", "PRO", "BUSINESS", "ENTERPRISE"],
  );
  assert.equal(arquivo.planos.filter((item) => item.recomendado).length, 1);
  assert.equal(arquivo.planos[2].recomendado, true);
  assert.equal(arquivo.planos[2].selo, null);
});

test("converte reais em centavos pelos dígitos", () => {
  assert.deepEqual(reaisParaCentavos("80,99"), { ok: true, centavos: 8099 });
  assert.deepEqual(reaisParaCentavos("80.99"), { ok: true, centavos: 8099 });
  assert.deepEqual(reaisParaCentavos("80,9"), { ok: true, centavos: 8090 });
  assert.equal(reaisParaCentavos("80,999").ok, false);
  assert.equal(reaisParaCentavos("").ok, false);
  assert.equal(reaisParaCentavos("-1").ok, false);
  assert.equal(reaisParaCentavos("0").ok, false);
  assert.equal(reaisParaCentavos("0,00").ok, false);
});

test("recusa catálogo fora das regras", () => {
  recusa((catalogo) => { catalogo.moeda = "USD"; }, "BRL");
  recusa((catalogo) => { catalogo.extra = true; }, "desconhecido");
  recusa((catalogo) => { catalogo.planos.pop(); }, "5 planos");
  recusa((catalogo) => { catalogo.planos.push(structuredClone(catalogo.planos[1])); }, "5 planos");
  recusa((catalogo) => {
    const [free, starter] = catalogo.planos;
    catalogo.planos[0] = starter;
    catalogo.planos[1] = free;
  }, "FREE");
  recusa((catalogo) => { catalogo.planos[1].codigo = "OUTRO"; }, "STARTER");
  recusa((catalogo) => { catalogo.planos[0].nome = "  "; }, "nome");
  recusa((catalogo) => { catalogo.planos[0].descricao = ""; }, "descrição");
  recusa((catalogo) => { catalogo.planos[0].selo = "   "; }, "selo");
  recusa((catalogo) => { catalogo.planos[2].recomendado = false; }, "recomendado");
  recusa((catalogo) => { catalogo.planos[1].recomendado = true; }, "recomendado");
  recusa((catalogo) => { catalogo.planos[0].precos = precos(1, 2, 3); }, "FREE não tem preço");
  recusa((catalogo) => { catalogo.planos[0].precoGbExcedenteCentavos = meios(1, 2, 3); }, "GB a mais");
  recusa((catalogo) => { catalogo.planos[0].franquiaPor.SEMANAL = "SEMANA"; }, "por mês");
  recusa((catalogo) => { catalogo.planos[1].precos.MENSAL.BOLETO = 1; }, "boleto");
  recusa((catalogo) => { catalogo.planos[1].precos.MENSAL.PIX = 0; }, "maiores que zero");
  recusa((catalogo) => { delete catalogo.planos[1].precos.SEMESTRAL; }, "SEMESTRAL");
  recusa((catalogo) => { catalogo.planos[1].franquiaGb = 0; }, "franquia");
  recusa((catalogo) => { catalogo.planos[1].retencaoDias = 1.5; }, "retenção");
  recusa((catalogo) => { catalogo.planos[1].membrosIncluidos = 0; }, "Membros");
  recusa((catalogo) => { catalogo.planos[1].produtosIncluidos = 0; }, "Produtos");
  recusa((catalogo) => { catalogo.planos[1].chamadasIaMes = null; }, "chamadas");
  recusa((catalogo) => { catalogo.planos[1].dashboard = "OUTRO"; }, "painel");
  recusa((catalogo) => { catalogo.planos[1].recursosAnalise = ["NAO_EXISTE"]; }, "Recurso");
  recusa((catalogo) => { catalogo.planos[1].recursosAnalise = ["SUGESTOES_IA", "SUGESTOES_IA"]; }, "Recurso");
  recusa((catalogo) => { catalogo.planos[1].extra = 1; }, "desconhecido");
  const ilimitado = catalogoValido();
  ilimitado.planos[4].membrosIncluidos = null;
  ilimitado.planos[4].produtosIncluidos = null;
  assert.equal(validateCatalog(ilimitado).ok, true);
});

test("ordena as chaves do arquivo", () => {
  const ordenado = ordenarCatalogo(catalogoValido());
  assert.deepEqual(Object.keys(ordenado), ["moeda", "planos"]);
  assert.equal(Object.keys(ordenado.planos[0])[0], "codigo");
  assert.equal(validateCatalog(ordenado).ok, true);
});
