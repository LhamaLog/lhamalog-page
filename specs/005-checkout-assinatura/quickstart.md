# Quickstart: checkout de assinatura ao contratar

Prova a spec 005. A regra pura está em [data-model.md](data-model.md). O pedido da página está em [contracts/contratacao.md](contracts/contratacao.md). O pedido ao Asaas está em [contracts/asaas-checkout.md](contracts/asaas-checkout.md).

Pré-requisito: Node 26 e `npm ci` na raiz. A página de desenvolvimento usa a porta 3000.

A chave real fica em `.env.local` (já ignorado pelo Git). Não cole a chave no chat nem a grave no repositório.

```bash
cp .env.example .env.local
```

Preencha `ASAAS_API_KEY` com a chave do sandbox. Deixe `ASAAS_BASE_URL` em `https://api-sandbox.asaas.com/v3` e `ASAAS_AMBIENTE` em `HOMOLOGACAO`. Sem essa chave, ou com `PRODUCAO`, os passos 1 e 2 ainda passam; o passo 3 mostra a contratação indisponível, que é o esperado. `HOMOLOGACAO` abre o sandbox em qualquer host.

## 1. Regra sem rede

```bash
npm test
```

Esperado: `tests/checkout.test.mjs` cobre as doze combinações de plano pago e periodicidade lendo `public/planos.json`. Em cada uma, o valor é o `CARTAO` em reais, o ciclo é `WEEKLY`, `MONTHLY` ou `SEMIANNUALLY`, o nome tem no máximo 30 caracteres e ainda mostra a periodicidade, e o endereço de testes é `https://sandbox.asaas.com/checkoutSession/show?id=...`. O mesmo teste recusa Free, periodicidade estranha, preço de cartão ausente, base que não é a oficial e `id` com `/`. `tests/links.test.mjs` continua provando que "Acessar Página" e "Começar grátis" vão ao app, e não prova mais que Contratar vai ao cadastro.

## 2. Pacote sem chave e sem o caminho antigo

```bash
npm run build
grep -R "ASAAS_API_KEY" dist && echo FALHOU || echo OK
grep -R "access_token" dist && echo FALHOU || echo OK
grep -R "assinatura/contratar" dist && echo FALHOU || echo OK
grep -R "from \"axios\"" src && echo FALHOU || echo OK
```

Esperado: as quatro buscas imprimem `OK`. "Começar grátis" ainda pode citar `app.lhamalog.com` dentro de `dist/`; isso não é falha.

## 3. Contratar no sandbox

Suba `npm run dev` e abra `http://localhost:3000/#planos`.

Esperado, com a chave de sandbox no `.env.local`:

- O cartão continua mostrando o preço de Pix. O seletor, os textos e os botões estão iguais aos de antes.
- Em cada plano pago, ao trocar semanal, mensal e semestral e clicar em Contratar, o navegador vai a `https://sandbox.asaas.com/checkoutSession/show?id=...` em menos de 5 segundos. O valor na página do Asaas é o de cartão daquela combinação, não o de Pix do cartão. O nome identifica o plano e a periodicidade e cabe em 30 caracteres.
- A barra de endereço não passa por `app.lhamalog.com`.
- "Começar grátis" abre o cadastro do app e não abre o Asaas.
- Um segundo clique, antes da página do Asaas abrir, não dispara outro pedido. No DevTools, há um único `POST /api/contratacao` para aquele clique.
- Voltar do Asaas para a landing não mostra frase de pagamento confirmado nem muda a seção de planos.

Sem a chave, ou com `ASAAS_BASE_URL` apontando para outro host: Contratar permanece na landing e mostra "A contratação não está disponível no momento. Tente novamente mais tarde." O topo, "Como funciona", os recursos, as perguntas e a chamada final continuam utilizáveis.

Repita o clique feliz uma vez com `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`, para o mesmo `POST /api/contratacao` existir fora do servidor de desenvolvimento.
