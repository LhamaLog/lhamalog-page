---

description: "Tarefas do ajuste local do catálogo de planos"
---

# Tasks: Ajuste local do catálogo de planos

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/catalogo.md](contracts/catalogo.md), [contracts/ajuste-local.md](contracts/ajuste-local.md), [quickstart.md](quickstart.md)

**Prerequisites**: plan.md e spec.md. Os demais documentos desta pasta também entram.

**Tests**: o plano e o quickstart pedem `node --test` para `src/features/subscription/catalogo.js` e para o desconto semestral lendo `public/planos.json`. Sem biblioteca nova de teste de tela. A prova visual fica no quickstart.

**Organization**: tarefas por história da spec, para cada uma poder ser feita e conferida sozinha.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivo diferente, sem depender de tarefa ainda aberta)
- **[Story]**: história da spec (US1, US2, US3)
- Caminhos a partir da raiz do repositório

## Path Conventions

- Página única: `src/`, `public/`, `tests/` na raiz
- Regra pura em `src/features/subscription/catalogo.js` (sem JSX e sem ler arquivo)
- Formulário só em `src/features/subscription/screens/dev/AjustePlanos.jsx`

## Mapa das histórias

| História | Prioridade | Onde entra |
|---|---|---|
| US1 Ver a oferta publicada, sem poder alterá-la | P1 | Fase 3 |
| US2 Ajustar a oferta no ambiente local | P1 | Fase 4 |
| US3 Recusar um catálogo que a página não pode mostrar | P2 | Fase 5 |

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: manter o projeto como está, sem pacote novo

- [X] T001 Conferir que `package.json` não ganha dependência e que os scripts continuam `dev` (`vite`), `build` (`vite build`), `preview` (`vite preview`) e `test` (`node --test tests/*.test.mjs`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: a validação e o arquivo que todas as histórias usam

**⚠️ CRITICAL**: nenhuma história começa antes do fim desta fase

- [X] T002 Escrever primeiro `tests/catalogo.test.mjs`, importando `../src/features/subscription/catalogo.js`, de forma que `npm test` falhe enquanto o módulo não existir. O teste aceita um catálogo válido e recusa, com lista de erros e sem corrigir o documento: `moeda` diferente de sempre `"BRL"`; `planos` que não sejam exatamente 5 itens, nesta ordem de `codigo`: `FREE`, `STARTER`, `PRO`, `BUSINESS`, `ENTERPRISE`; `codigo` repetido ou fora desses cinco; `nome` que não seja texto não vazio; `descricao` que não seja texto não vazio; `selo` só com espaço (o selo ausente legítimo é `null`); `recomendado` sem exatamente um `true`; `precos` preenchido no Free ou, nos pagos, sem `SEMANAL`, `MENSAL` e `SEMESTRAL`, sem `PIX`, `BOLETO`, `CARTAO` e `DEBITO` em centavos inteiros maiores que zero, ou com `BOLETO` diferente de `PIX`; `franquiaGb` que não seja número maior que zero; `franquiaPor` fora de `"SEMANA"` ou `"MES"`, e no Free diferente de `"MES"` nos três períodos; `precoGbExcedenteCentavos` e `precoArmazenamentoExtraCentavos` fora da regra `null` no Free e, nos pagos, os quatro meios em centavos inteiros maiores que zero com boleto igual ao Pix; `retencaoDias` que não seja inteiro maior que zero; `dashboard` fora de `BASICO`, `PADRAO` ou `PERSONALIZADO`; `recursosAnalise` com repetição ou código fora de `SUGESTOES_BASICAS`, `SUGESTOES_IA`, `DETECCAO_ANOMALIAS`, `INVESTIGACAO_AUTOMATICA`, `RASTREIO_USUARIO`; `chamadasIaMes` que não seja inteiro maior que zero; `membrosIncluidos` ou `produtosIncluidos` iguais a zero (`null` permanece ilimitado); campo desconhecido. Também recusa reais com mais de duas casas, vazio ou negativo em `reaisParaCentavos`, e aceita `80,99` e `80.99` como `8099` montado pelos dígitos, sem multiplicar ponto flutuante
- [X] T003 Implementar `validateCatalog` e `reaisParaCentavos` em `src/features/subscription/catalogo.js` até `tests/catalogo.test.mjs` passar. O módulo não importa React, não lê arquivo e não altera o objeto recebido. As regras são as citadas em T002, copiadas de `specs/004-ajuste-planos-local/data-model.md`
- [X] T004 Criar `public/planos.json` movendo os números de `src/features/subscription/mocks/plans.js` e os textos de `specs/004-ajuste-planos-local/research.md` (FREE "Para conhecer o LhamaLog" / "Para começar"; STARTER "Para um time pequeno com poucos produtos" / "Mais acessível"; PRO "Para times que dependem dos logs todo dia" / selo `null` e `recomendado` true; BUSINESS "Para empresas com vários produtos" / "Mais capacidade"; ENTERPRISE "Para operações grandes e personalizadas" / "Mais completo"). `moeda` é `"BRL"`. Não gravar `atual`. Chaves na ordem do modelo, indentação de dois espaços e quebra de linha no fim. `validateCatalog` precisa aceitar o arquivo

**Checkpoint**: validação e arquivo vigentes. A página ainda pode ler o mock até a Fase 3

---

## Phase 3: User Story 1 - Ver a oferta publicada, sem poder alterá-la (Priority: P1) 🎯 MVP

**Goal**: a seção de planos mostra o JSON, com os mesmos cartões de hoje, e o site publicado não tem como salvar outra oferta

**Independent Test**: abrir a página publicada, percorrer semanal, mensal e semestral e conferir preço de Pix, franquia, limites, textos e selos iguais ao arquivo. Procurar no menu, na seção, no rodapé e em `/#ajustar-planos` um jeito de salvar. Nenhum caminho muda o que outro visitante vê.

### Implementation for User Story 1

- [X] T005 [P] [US1] Trocar `tests/plan-savings.test.mjs` para ler `public/planos.json` com `node:fs` em vez de `fakePlans` de `src/features/subscription/mocks/plans.js`. Manter as travas: Free sem desconto, Starter economiza 995 centavos no Pix (2%) e o teto entre os planos é 2%
- [X] T006 [P] [US1] Fazer `src/features/subscription/hooks/usePlans.js` buscar `GET /planos.json` com `cache: "no-store"`, começar em carregando, e, se `validateCatalog` aceitar, devolver `{ moeda, planos }` com `atual: false` em cada plano. Não importar `src/features/subscription/mocks/plans.js`
- [X] T007 [P] [US1] Em `src/features/subscription/screens/public/PublicPlanCard.jsx`, ler `plan.descricao` e `plan.selo` e apagar as constantes `DESCRIPTIONS` e `BADGES`. Selo `null` não desenha etiqueta. Manter classes, preço de Pix, "Começar grátis" no Free, "Contratar" nos pagos e a nota "Ao chegar na franquia, a ingestão pausa." Não acrescentar aviso de teste grátis
- [X] T008 [P] [US1] Em `src/features/subscription/screens/public/PlansCatalog.jsx`, usar `plan.recomendado === true` no lugar da constante `RECOMMENDED_PLAN`. Manter seletor, grade e estados de carregando, erro e vazio
- [X] T009 [US1] Apagar `src/features/subscription/mocks/plans.js` quando `src/features/subscription/hooks/usePlans.js` e `tests/plan-savings.test.mjs` não o importarem mais, e conferir que nenhuma outra referência a `fakePlans` restou

**Checkpoint**: com o JSON válido, a landing mostra a oferta de hoje. Ainda não existe formulário

---

## Phase 4: User Story 2 - Ajustar a oferta no ambiente local (Priority: P1)

**Goal**: quem abre `npm run dev` em localhost ajusta a oferta num formulário e o salvamento grava `public/planos.json`

**Independent Test**: em `http://localhost:3000/#ajustar-planos`, mudar o preço mensal no Pix e a franquia de um plano, salvar e ver os cartões dessa execução. O arquivo muda. O resultado de `npm run build` não mostra o formulário.

### Implementation for User Story 2

- [X] T010 [P] [US2] Criar `vite.planos.js` com plugin que só usa `configureServer`. `POST /__dev/planos` com `Host` `localhost`, `127.0.0.1` ou `::1` (com ou sem porta) lê o corpo, chama `validateCatalog` de `src/features/subscription/catalogo.js` e, se passar, grava somente `public/planos.json` (caminho fixo, indentação de dois espaços, quebra de linha no fim) e responde `200` `{ "ok": true }`
- [X] T011 [US2] Registrar o plugin de `vite.planos.js` em `vite.config.js`, sem mudar porta, `host` nem `allowedHosts`
- [X] T012 [P] [US2] Criar `src/features/subscription/screens/dev/AjustePlanos.jsx` com os cinco planos e os campos do modelo. Preço, GB a mais e armazenamento extra em reais (vírgula ou ponto, no máximo duas casas), convertidos por `reaisParaCentavos`. Sem campo de boleto: ao montar o corpo, `BOLETO` recebe o valor de `PIX` em cada periodicidade e em cada valor extra. Sem campo de desconto semestral. Membros ou produtos sem quantidade saem `null`. Salvar envia o catálogo já em centavos para `POST /__dev/planos` e, no `200`, a seção da mesma execução mostra os valores novos
- [X] T013 [US2] Em `src/features/landing/components/PlansSection.jsx`, mostrar o link "Ajustar planos" para `/#ajustar-planos` e carregar `AjustePlanos.jsx` só quando `import.meta.env.DEV` for verdadeiro e o hostname for `localhost`, `127.0.0.1` ou `::1`, com import dinâmico dentro desse `if`. Fora disso não renderizar link, formulário nem import estático

**Checkpoint**: o ajuste local grava o arquivo. O pacote de `npm run build` ainda não contém o formulário

---

## Phase 5: User Story 3 - Recusar um catálogo que a página não pode mostrar (Priority: P2)

**Goal**: salvamento inválido não troca o arquivo, e catálogo ausente ou ilegível no site não derruba o resto da landing

**Independent Test**: salvar um preço negativo e ver o arquivo anterior intacto, com o erro no formulário. Servir um `planos.json` vazio ou quebrado e ver "Falha ao carregar os planos" e "Tentar novamente", com topo, "Como funciona", recursos, perguntas e chamada final utilizáveis.

### Implementation for User Story 3

- [X] T014 [US3] Completar `vite.planos.js` para não gravar quando `validateCatalog` falhar, o corpo não for JSON ou passar de 100 KB: responder `400` `{ "ok": false, "erros": ["..."] }`. Host que não seja `localhost`, `127.0.0.1` ou `::1`, outro método ou outro caminho recebem `404`
- [X] T015 [US3] Em `src/features/subscription/screens/dev/AjustePlanos.jsx`, no `400`, listar `erros` e manter o rascunho. Não tratar como salvo e não substituir `public/planos.json`
- [X] T016 [US3] Em `src/features/subscription/hooks/usePlans.js`, se o arquivo vier ausente, ilegível ou reprovado por `validateCatalog`, definir o erro "Não foi possível ler o catálogo de planos." para o `ErrorState` já usado em `src/features/subscription/screens/public/PlansCatalog.jsx` ("Falha ao carregar os planos" e "Tentar novamente"). Não usar oferta reserva. O restante de `src/features/landing/LandingPage.jsx` continua montado

**Checkpoint**: as três histórias funcionam. Oferta inválida não apaga a anterior nem a landing

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: fechar a documentação curta e o roteiro de prova

- [X] T017 [P] Atualizar o parágrafo de layout em `README.md` para citar `public/planos.json` como a oferta da página, no lugar de só o mock em `src/features/subscription/`
- [X] T018 Executar `specs/004-ajuste-planos-local/quickstart.md`: `npm test`, `npm run build`, as duas buscas em `dist/` por `Ajustar planos` e `__dev/planos` (as duas precisam imprimir OK) e o roteiro manual do dev em localhost. Se uma busca achar o texto, corrigir o import em `src/features/landing/components/PlansSection.jsx`. Ao terminar ensaios que alterem o arquivo, restaurar `public/planos.json`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: começa imediato
- **Foundational (Phase 2)**: depende da Fase 1 e bloqueia todas as histórias
- **User Stories (Phase 3+)**: dependem da Fase 2
- **Polish (Phase 6)**: depende das histórias que forem entrar na entrega

### User Story Dependencies

- **User Story 1 (P1)**: depois da Fase 2. Não depende de US2 nem de US3
- **User Story 2 (P1)**: depois da Fase 2. Usa o JSON e a validação; não precisa da troca de cartão da US1 para gravar, mas a conferência dos cartões depois de salvar fica completa com a US1
- **User Story 3 (P2)**: o erro na página publicada depende de T006; o salvamento recusado depende de T010 e T012

### Within Each User Story

- T002 fica vermelho antes de T003
- T004 só depois de T003
- T009 só depois de T005 e T006
- T011 só depois de T010
- T013 só depois de T012
- T014 só depois de T010
- T015 só depois de T012 e T014
- T016 só depois de T006

### Parallel Opportunities

- T005, T006, T007 e T008 (arquivos diferentes, depois da Fase 2)
- T010 e T012 (plugin e formulário)
- T017 em paralelo com a preparação do quickstart, antes de T018 fechar a prova

---

## Parallel Example: User Story 1

```bash
# Depois de T004, juntos:
Task: "Trocar tests/plan-savings.test.mjs para ler public/planos.json"
Task: "Fazer src/features/subscription/hooks/usePlans.js buscar GET /planos.json"
Task: "Ler plan.descricao e plan.selo em src/features/subscription/screens/public/PublicPlanCard.jsx"
Task: "Usar plan.recomendado em src/features/subscription/screens/public/PlansCatalog.jsx"
```

---

## Parallel Example: User Story 2

```bash
# Depois da Fase 2, juntos:
Task: "Criar vite.planos.js com POST /__dev/planos"
Task: "Criar src/features/subscription/screens/dev/AjustePlanos.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Terminar a Fase 1
2. Terminar a Fase 2
3. Terminar a Fase 3
4. Parar e conferir a US1: página publicada mostra o JSON e não oferece salvamento
5. A página já pode ir ao ar com a oferta em arquivo, ainda sem formulário

### Incremental Delivery

1. Setup + Foundational deixam a validação e o JSON prontos
2. US1 troca a leitura da página para o arquivo
3. US2 acrescenta o formulário só no dev local
4. US3 fecha a recusa e a falha visível
5. A Fase 6 roda o quickstart

### Parallel Team Strategy

1. Todo mundo termina as Fases 1 e 2
2. Em seguida: uma pessoa na US1 (T005 a T009), outra na US2 (T010 e T012)
3. A US3 entra quando T006, T010 e T012 existirem

---

## Notes

- [P] significa arquivo diferente e sem depender de tarefa aberta
- O código enviado em "Contratar" permanece `FREE`, `STARTER`, `PRO`, `BUSINESS`, `ENTERPRISE`
- Não instalar pacote
- Não criar serviço externo
- Não colocar senha no JavaScript da página
