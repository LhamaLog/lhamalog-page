---

description: "Tarefas do checkout de assinatura ao contratar"
---

# Tasks: Checkout de assinatura ao contratar

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/contratacao.md](contracts/contratacao.md), [contracts/asaas-checkout.md](contracts/asaas-checkout.md), [quickstart.md](quickstart.md)

**Prerequisites**: plan.md e spec.md. Os demais documentos desta pasta também entram.

**Tests**: o plano e o quickstart pedem `node --test` para a regra pura em `src/features/subscription/checkout.js` e para os endereços de "Acessar Página" e "Começar grátis". A chamada real ao Asaas fica no quickstart, com a chave só no `.env.local`.

**Organization**: tarefas por história da spec, para cada uma poder ser feita e conferida sozinha.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivo diferente, sem depender de tarefa ainda aberta)
- **[Story]**: história da spec (US1, US2, US3)
- Caminhos a partir da raiz do repositório

## Path Conventions

- Página única: `src/`, `tests/` e `vite.*.js` na raiz
- Regra pura em `src/features/subscription/checkout.js` (sem JSX, sem Axios, sem ler arquivo e sem ler ambiente)
- Chamada ao Asaas só em `vite.checkout.js`

## Mapa das histórias

| História | Prioridade | Onde entra |
|---|---|---|
| US1 Contratar o plano na página do Asaas | P1 | Fase 3 |
| US2 Pagar sem entregar o cartão nem a chave de acesso | P1 | Fase 4 |
| US3 Seguir na página quando o checkout não abre | P2 | Fase 5 |

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: a única dependência nova e o exemplo de configuração, sem chave utilizável

- [X] T001 [P] Acrescentar `axios` em `dependencies` de `package.json` (não em `devDependencies`) e atualizar `package-lock.json` com `npm install`. Manter os scripts `dev` (`vite`), `build` (`vite build`), `preview` (`vite preview`) e `test` (`node --test tests/*.test.mjs`). Não importar Axios em `src/`
- [X] T002 [P] Em `.env.example`, manter `VITE_APP_URL` para "Acessar Página" e "Começar grátis". Acrescentar `ASAAS_BASE_URL=https://api-sandbox.asaas.com/v3` e `ASAAS_API_KEY` com um texto que não seja chave (por exemplo `cole-a-chave-do-sandbox-aqui`). O comentário diz que Contratar não usa mais `VITE_APP_URL`, que a base de produção `https://api.asaas.com/v3` só entra depois do CNPJ, e que o arquivo real continua fora do Git

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: a regra do pedido e do endereço, usada pelas três histórias

**⚠️ CRITICAL**: nenhuma história começa antes do fim desta fase

- [X] T003 Escrever primeiro `tests/checkout.test.mjs`, importando `montarPedido` e `urlDoCheckout` de `../src/features/subscription/checkout.js`, de forma que `npm test` falhe enquanto o módulo não existir. Para cada um de `STARTER`, `PRO`, `BUSINESS` e `ENTERPRISE` e cada um de `SEMANAL`, `MENSAL` e `SEMESTRAL`, ler `public/planos.json` e exigir: `billingTypes` exatamente `["CREDIT_CARD"]`; `chargeTypes` exatamente `["RECURRENT"]`; `minutesToExpire` exatamente `60`; `quantity` exatamente `1`; `value` igual a `precos[periodo].CARTAO / 100` com duas casas e diferente do Pix; `subscription.cycle` `WEEKLY`, `MONTHLY` ou `SEMIANNUALLY` nessa ordem de periodicidade; `subscription` sem `endDate`; corpo sem `customer`, `customerData` e `installment`; `externalReference` exatamente `{codigo}:{periodo}` com no máximo 200 caracteres; `items[0].name` com no máximo 30 caracteres, começando por `Plano ` e terminando em `(semanal)`, `(mensal)` ou `(semestral)`; `items[0].description` exatamente `LhamaLog - Plano {nome} ({sufixo})` com o nome inteiro. Com `agora` fixo em `2026-11-17T15:13:00Z`, `nextDueDate` é `2026-11-17 12:13:00` (America/Sao_Paulo). Com nome `Supercalifragilistico` e período `MENSAL`, o nome curto é `Plano Supercalifragil (mensal)` (30 caracteres) e a descrição mantém o nome inteiro. `callback.successUrl`, `cancelUrl` e `expiredUrl` são a origem recebida com barra no fim (`https://lhamalog.com/`). `urlDoCheckout("https://api-sandbox.asaas.com/v3", "abc-123")` é `https://sandbox.asaas.com/checkoutSession/show?id=abc-123`. A base `https://api.asaas.com/v3` usa o host `asaas.com` e o mesmo caminho. `montarPedido` devolve indisponível para `FREE`, periodicidade fora das três, centavos ausentes, zero ou negativos, e para nome vazio. `urlDoCheckout` devolve indisponível para base diferente dessas duas (inclusive com barra no fim), e para `id` vazio ou com `/`, `?` ou `&`
- [X] T004 Implementar `montarPedido` e `urlDoCheckout` em `src/features/subscription/checkout.js` até `tests/checkout.test.mjs` passar. O módulo não importa React, Axios, `node:fs` nem `process.env`. `montarPedido({ codigo, nome, periodo, centavosCartao, origem, agora })` devolve `{ disponivel: false }` ou `{ disponivel: true, pedido }`. `urlDoCheckout(baseUrl, id)` devolve `{ disponivel: false }` ou `{ disponivel: true, url }`. As regras são as citadas em T003, copiadas de `specs/005-checkout-assinatura/data-model.md` e de `specs/005-checkout-assinatura/contracts/asaas-checkout.md`

**Checkpoint**: as doze combinações e as recusas estão travadas sem rede. A página ainda manda Contratar para o app

---

## Phase 3: User Story 1 - Contratar o plano na página do Asaas (Priority: P1) 🎯 MVP

**Goal**: Contratar, num plano pago, abre a página de pagamento do Asaas com o plano, a periodicidade e o preço de cartão do catálogo, e não passa por app.lhamalog.com

**Independent Test**: com a chave de sandbox no `.env.local` e `npm run dev`, trocar semanal, mensal e semestral em Starter, Pro, Business e Enterprise, clicar em Contratar e chegar a `https://sandbox.asaas.com/checkoutSession/show?id=...` em menos de 5 segundos, com o valor de cartão daquela combinação. "Começar grátis" continua no cadastro. Os cartões não mudam de desenho.

### Tests for User Story 1

- [X] T005 [P] [US1] Em `tests/links.test.mjs`, apagar as asserções de `contractUrl` (Contratar no cadastro, endereço inválido e plano estranho). Manter `signInUrl` e `signUpUrl`, inclusive o padrão `https://app.lhamalog.com/sign-in` e `https://app.lhamalog.com/sign-up`. O teste deve falhar enquanto `src/shared/appLinks.js` ainda exportar `contractUrl`

### Implementation for User Story 1

- [X] T006 [P] [US1] Criar `vite.checkout.js` com middleware em `configureServer` e `configurePreviewServer`. Só `POST /api/contratacao` cria checkout; outro método segue o Vite. Ler o corpo JSON `{ plano, periodo }`, ignorar qualquer outro campo (em especial valor, nome e endereço), ler `public/planos.json`, aceitar só se `validateCatalog` de `src/features/subscription/catalogo.js` passar, achar o plano pelo `codigo` e usar `montarPedido` com o `nome` do arquivo e `precos[periodo].CARTAO`. No sucesso, Axios faz `POST {ASAAS_BASE_URL}/checkouts` e a resposta `200` da rota é `{ url }` montada por `urlDoCheckout` com o `id` devolvido. Não gravar o `id`
- [X] T007 [US1] Registrar o plugin de `vite.checkout.js` em `vite.config.js`, ao lado de `planosDevPlugin`, sem mudar porta, `strictPort` nem `allowedHosts`
- [X] T008 [US1] Remover `contractUrl` de `src/shared/appLinks.js`. Manter `DEFAULT_APP_URL`, `signInUrl` e `signUpUrl` até `tests/links.test.mjs` passar
- [X] T009 [US1] Em `src/features/landing/components/PlansSection.jsx`, trocar o `subscribe` dos planos pagos: `POST /api/contratacao` com `{ plano: plan.codigo, periodo }` e, se o JSON tiver `url` de `https://sandbox.asaas.com/checkoutSession/show?id=` ou `https://asaas.com/checkoutSession/show?id=`, fazer `window.location.assign(url)`. Não usar `contractUrl`. Não alterar classes, textos, seletor nem o botão. "Começar grátis" continua em `signUpUrl` de `src/shared/appLinks.js`, e `src/features/subscription/screens/public/PublicPlanCard.jsx` não muda

**Checkpoint**: com chave e base de sandbox, Contratar abre o Asaas. Ainda falta fechar o segredo e a falha

---

## Phase 4: User Story 2 - Pagar sem entregar o cartão nem a chave de acesso (Priority: P1)

**Goal**: a chave não entra na página nem no Git, o Asaas é chamado só pelo processo da página, e voltar da página de pagamento não confirma assinatura

**Independent Test**: procurar chave utilizável no que o navegador recebe e no Git. Ir ao Asaas e voltar: a landing não diz que o pagamento foi feito. Enquanto a base for a de testes, o host da página de pagamento é `sandbox.asaas.com`.

### Tests for User Story 2

- [X] T010 [P] [US2] Criar `tests/segredo.test.mjs` lendo a árvore `src/` com `node:fs`. Falha se algum arquivo importar Axios (`from "axios"` ou `require("axios")`), se aparecer `ASAAS_API_KEY`, `access_token` ou `import.meta.env.ASAAS`, ou se `src/features/landing/components/PlansSection.jsx` ou `src/features/landing/LandingPage.jsx` lerem `location.search` ou escreverem "pagamento confirmado". O teste passa no código atual e tem de continuar passando depois do plugin

### Implementation for User Story 2

- [X] T011 [US2] Em `vite.checkout.js`, ler `ASAAS_API_KEY` e `ASAAS_BASE_URL` só de `process.env` (o Vite já carrega `.env` e `.env.local` no processo; variável do container ganha da do arquivo). Enviar no Axios os cabeçalhos `access_token` (a chave) e `User-Agent` com o valor `LhamaLog-Page`, `Content-Type: application/json` e timeout de 8000 ms. A origem do `callback` sai do `Origin` do pedido quando o host bater com o `Host`; senão, do esquema (`x-forwarded-proto` ou `http`) mais o `Host`. As três URLs são essa origem com `/` no fim. Não enviar `customer` nem `customerData`. Não gravar a chave em log. Se o Axios falhar, responder `503` com `{ disponivel: false }` e sem o corpo de erro

**Checkpoint**: a chave fica no processo. A página de retorno é a própria landing, sem frase de confirmação

---

## Phase 5: User Story 3 - Seguir na página quando o checkout não abre (Priority: P2)

**Goal**: configuração ausente, preço de cartão inválido ou Asaas fora do ar deixam a pessoa na landing, com a frase que já existe, e um segundo clique não abre outro checkout

**Independent Test**: tirar `ASAAS_API_KEY`, clicar em Contratar e ver "A contratação não está disponível no momento. Tente novamente mais tarde." O topo, "Como funciona", os recursos, as perguntas e a chamada final seguem utilizáveis. Com a chave de volta, um único `POST /api/contratacao` sai por clique.

### Implementation for User Story 3

- [X] T012 [P] [US3] Em `vite.checkout.js`, responder `503` e `{ disponivel: false }` sem chamar o Asaas quando a chave ou a base estiverem ausentes ou vazias, quando `urlDoCheckout` ou `montarPedido` devolverem `disponivel: false`, quando `validateCatalog` recusar o arquivo, quando o plano não existir, ou quando a resposta do Asaas não tiver `id` string utilizável. Corpo maior que 100 KB ou JSON inválido também é `503` com esse mesmo corpo, sem detalhe do erro. `GET` e os outros métodos não criam checkout
- [X] T013 [P] [US3] Em `src/features/landing/components/PlansSection.jsx`, enquanto o `POST /api/contratacao` não voltou, ignorar outro clique sem trocar a classe do botão. No fracasso (rede, status diferente de 200, ou `url` fora dos dois hosts), ligar o aviso que já usa `SUPPORT_TEXTS.contratarIndisponivel` de `src/features/landing/content.js` e permitir novo clique. No sucesso, navegar e não disparar outro pedido. Não criar texto nem estilo novo

**Checkpoint**: as três histórias funcionam. Contratar indisponível não manda ninguém ao app

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: documentação e a prova do quickstart

- [X] T014 [P] Atualizar a tabela de configuração e o parágrafo de Contratar em `README.md`: "Acessar Página" e "Começar grátis" continuam em `VITE_APP_URL` (padrão `https://app.lhamalog.com`); Contratar usa `ASAAS_BASE_URL` e `ASAAS_API_KEY`; o exemplo é `.env.example`; a chave real fica em `.env.local` ou no ambiente do container
- [X] T015 Executar `specs/005-checkout-assinatura/quickstart.md`: `npm test`, `npm run build` e as quatro buscas (`ASAAS_API_KEY`, `access_token` e `assinatura/contratar` ausentes em `dist/`; `from "axios"` ausente em `src/`). Cada busca precisa imprimir `OK`. Com chave de sandbox, o passo 3 no `npm run dev` e uma vez no `vite preview`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Fase 1)**: pode começar já
- **Foundational (Fase 2)**: depende da Fase 1 (o teste não precisa do Axios; a Fase 2 pode seguir T002, e T001 precisa estar feito antes de T006)
- **Histórias (Fases 3 a 5)**: dependem da Fase 2
- **Polish (Fase 6)**: depende das histórias que forem entrar na prova

### User Story Dependencies

- **US1 (P1)**: começa depois da Fase 2. Não depende de US2 nem de US3
- **US2 (P1)**: começa depois de T006, porque completa o mesmo `vite.checkout.js`. A prova de segredo (T010) pode ser escrita em paralelo à US1
- **US3 (P2)**: começa depois de T009 e T011. O clique e o `503` fecham o caminho que a US1 abre

### Within Each User Story

- O teste da US1 (T005) pode nascer junto com o plugin (T006)
- T007 espera T006. T008 espera T005. T009 espera T008
- T011 espera T006. T010 não espera o plugin
- T012 e T013 são arquivos diferentes e podem andar juntos depois de T011 e T009

### Parallel Opportunities

- T001 e T002
- T005 e T006, depois da Fase 2
- T010 junto da Fase 3
- T012 e T013, depois da Fase 4
- T014 junto de T012 e T013; T015 por último

---

## Parallel Example: User Story 1

```bash
# Depois de T004, juntos:
Task: "Apagar as asserções de contractUrl em tests/links.test.mjs"
Task: "Criar vite.checkout.js com POST /api/contratacao"
```

---

## Parallel Example: User Story 2

```bash
# T010 não espera o plugin:
Task: "Criar tests/segredo.test.mjs varrendo src/"
```

---

## Parallel Example: User Story 3

```bash
# Depois de T011 e T009, juntos:
Task: "Responder 503 em vite.checkout.js"
Task: "Ignorar o segundo clique em src/features/landing/components/PlansSection.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Terminar a Fase 1
2. Terminar a Fase 2
3. Terminar a Fase 3
4. Parar e conferir a US1: Contratar abre o sandbox do Asaas com o preço de cartão, e "Começar grátis" segue no app
5. A página já pode ser demonstrada com chave de sandbox, antes de fechar segredo e falha

### Incremental Delivery

1. Setup + Foundational deixam a regra das doze combinações pronta, sem rede
2. US1 liga o botão ao Asaas
3. US2 tira a chave do pacote e impede a volta de contar como pagamento
4. US3 mostra a indisponibilidade que a página já tem e segura o clique repetido
5. A Fase 6 atualiza o README e roda o quickstart

### Parallel Team Strategy

1. Todo mundo termina as Fases 1 e 2
2. Em seguida: uma pessoa na US1 (T006, T007, T009) e outra em T005 e T010
3. A US2 (T011) entra quando T006 existir
4. A US3 reparte T012 e T013 quando T009 e T011 existirem

---

## Notes

- [P] significa arquivo diferente e sem depender de tarefa aberta
- O preço enviado ao Asaas é `precos[periodo].CARTAO` do `public/planos.json`. O cartão da página continua mostrando o Pix
- Não criar formulário, seletor de forma de pagamento nem aviso de teste grátis
- Não gravar o `id` do checkout e não tratar a URL de volta como pagamento confirmado
- Pix, débito, boleto, teste de 14 dias, webhook, nota fiscal e ativação de conta ficam fora
