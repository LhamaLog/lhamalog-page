import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

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

test("o pacote publicado não contém a chave nem access_token", () => {
  const raiz = fileURLToPath(new URL("..", import.meta.url));
  const saida = mkdtempSync(join(tmpdir(), "checkout-dist-"));
  execFileSync("npm", ["run", "build", "--", "--outDir", saida, "--emptyOutDir"], { cwd: raiz, stdio: "pipe" });
  const textos = [];
  const visitar = (pasta) => {
    for (const nome of readdirSync(pasta)) {
      const caminho = join(pasta, nome);
      if (statSync(caminho).isDirectory()) visitar(caminho);
      else if (/\.(js|html|css)$/.test(nome)) textos.push(readFileSync(caminho, "utf8"));
    }
  };
  visitar(saida);
  const junto = textos.join("\n");
  assert.equal(junto.includes("ASAAS_API_KEY"), false);
  assert.equal(junto.includes("access_token"), false);
  assert.equal(junto.includes("assinatura/contratar"), false);
  assert.equal(junto.includes("$aact_"), false);
});

test("Contratar libera o clique quando o navegador restaura a página", () => {
  const texto = readFileSync(
    new URL("../src/features/landing/components/PlansSection.jsx", import.meta.url),
    "utf8",
  );
  assert.equal(texto.includes("pageshow"), true);
  assert.equal(texto.includes("destinoContratacao"), true);
  assert.equal(texto.includes("window.location.assign(destino.url)"), true);
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
