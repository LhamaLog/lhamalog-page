import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function arquivos(diretorio) {
  const lista = [];
  for (const nome of readdirSync(diretorio)) {
    const caminho = join(diretorio, nome);
    if (statSync(caminho).isDirectory()) lista.push(...arquivos(caminho));
    else lista.push(caminho);
  }
  return lista;
}

const fonte = arquivos(new URL("../src", import.meta.url).pathname)
  .filter((caminho) => /\.(js|jsx)$/.test(caminho))
  .map((caminho) => ({ caminho, texto: readFileSync(caminho, "utf8") }));

test("o pacote da página não importa Axios nem a chave do Asaas", () => {
  for (const { caminho, texto } of fonte) {
    assert.equal(/from ["']axios["']|require\(["']axios["']\)/.test(texto), false, caminho);
    assert.equal(texto.includes("ASAAS_API_KEY"), false, caminho);
    assert.equal(texto.includes("access_token"), false, caminho);
    assert.equal(texto.includes("import.meta.env.ASAAS"), false, caminho);
  }
});

test("a landing não trata a volta do pagamento como confirmação", () => {
  const alvos = fonte.filter(
    (item) =>
      item.caminho.endsWith("PlansSection.jsx") || item.caminho.endsWith("LandingPage.jsx"),
  );
  assert.equal(alvos.length, 2);
  for (const { caminho, texto } of alvos) {
    assert.equal(texto.includes("location.search"), false, caminho);
    assert.equal(texto.includes("pagamento confirmado"), false, caminho);
  }
});
