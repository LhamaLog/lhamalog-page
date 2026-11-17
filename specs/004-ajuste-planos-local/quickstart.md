# Quickstart: ajuste local do catálogo de planos

Prova a spec 004 sem biblioteca nova. Regras do arquivo: [contracts/catalogo.md](contracts/catalogo.md). Formulário e gravação: [contracts/ajuste-local.md](contracts/ajuste-local.md).

Pré-requisito: Node 26, dependências já instaladas (`npm ci` na raiz). A página de desenvolvimento usa a porta 3000.

Antes de editar o catálogo de propósito, guarde o arquivo. No fim, devolva o original:

```bash
git checkout -- public/planos.json
```

## 1. Regra do catálogo

```bash
npm test
```

Esperado: `tests/catalogo.test.mjs` aceita `public/planos.json` e recusa os casos do FR-006 (nome vazio, recomendado a mais ou a menos, código estranho, quantidade ou ordem erradas, número ≤ 0, Free com preço, pago incompleto, boleto diferente do Pix, recurso ou painel desconhecido, reais com mais de duas casas). `tests/plan-savings.test.mjs` continua passando com os números do JSON (Starter economiza 995 centavos no Pix, teto de 2%).

## 2. Site publicado sem formulário

```bash
npm run build
grep -R "Ajustar planos" dist && echo FALHOU || echo OK
grep -R "__dev/planos" dist && echo FALHOU || echo OK
```

Esperado: as duas buscas imprimem `OK`.

Sirva a pasta gerada com `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` e abra o endereço que o comando mostrar, com `/#ajustar-planos` no fim.

Esperado: a landing abre com os cinco planos iguais à oferta de hoje (Pro em destaque, Pix no cartão, boleto igual ao Pix). Não há link "Ajustar planos", não há formulário e não há botão de salvar. O topo e as outras seções aparecem mesmo que se troque `planos.json` publicado por um arquivo vazio: a seção de planos mostra "Falha ao carregar os planos" e "Tentar novamente"; o resto da página segue utilizável. Restaure o arquivo depois desse ensaio.

## 3. Ajuste no ambiente local

Suba `LHAMALOG_AJUSTE_PLANOS=1 npm run dev` e abra `http://localhost:3000/#ajustar-planos`. Sem a variável, o mesmo comando não mostra o formulário e não grava.

Esperado: o formulário lista os cinco planos. Altere o nome, o preço mensal no Pix e a franquia de um plano pago, com um valor de duas casas, e salve.

Esperado: os cartões dessa mesma página mostram os novos valores na periodicidade mensal; `public/planos.json` mudou; o desenho do cartão (classes, seletor, "Contratar", sem teste grátis) permanece. "Contratar" continua levando o código antigo (`STARTER`, `PRO`, `BUSINESS` ou `ENTERPRISE`) e a periodicidade escolhida.

Tente salvar um preço negativo ou apagar o nome.

Esperado: o formulário explica o erro e o arquivo não muda.

Abra o mesmo `npm run dev` por um hostname que não seja localhost (o domínio público configurado no Vite, se estiver acessível).

Esperado: `/#ajustar-planos` não mostra o formulário. `POST /__dev/planos` responde 404 e não grava.

## 4. O que ainda não foi publicado

Com o JSON local já alterado e o site público ainda na publicação anterior, abra o site público.

Esperado: o visitante vê a oferta da publicação anterior, sem formulário.

Ao terminar os ensaios locais, restaure `public/planos.json` com o comando do início.
