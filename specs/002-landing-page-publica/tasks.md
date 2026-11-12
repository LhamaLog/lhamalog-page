---

description: "Tarefas da landing page pública do LhamaLog"
---

# Tasks: Landing page pública do LhamaLog

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/ui-contract.md](contracts/ui-contract.md), [quickstart.md](quickstart.md)

**Regras desta execução** (do pedido e de `docs/instrucoes-agentes.md`): sem Git, sem pacote novo, sem mexer em Clerk (só `useAuth`, leitura), sem escopo além da spec e do plano. Conferir mudanças por leitura e comparação de arquivos. **Cada fase termina com uma PARADA: não começar a fase seguinte antes de o André revisar.**

**Tests**: o plano pede só testes de módulos TypeScript puros com `node --test` (sem biblioteca nova). Telas são conferidas por `npm run build` e pelo roteiro do quickstart.

**Regra dos testes**: arquivos testados por `node --test` (`content.ts`, `legalLinks.ts`, `landingTokens.ts`, `contractLink.ts`) **não podem ter `import`** de outros arquivos nem ler `import.meta.env`; ficam puros (o Node carrega TypeScript direto e não resolve importações sem extensão).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem depender de tarefa aberta)
- **[Story]**: história da spec (US1 a US5)
- Caminhos a partir da raiz do projeto (`tela-planos-publica/`)

## Mapa das histórias

| História | Prioridade | Onde entra |
|---|---|---|
| US1 Entender o produto e começar grátis | P1 | Fase 3 (barra e topo) e Fase 4 (visível na rota) |
| US2 Como funciona e recursos | P2 | Fase 3 |
| US3 Ver planos e contratar | P2 | Fase 2 (base compartilhada), Fase 3 (seção) e Fase 5 ("Contratar") |
| US4 Perguntas, chamada final e rodapé | P3 | Fase 3 |
| US5 Quem já está logado | P2 | Fase 4 |

---

## Phase 1: Setup

**Purpose**: preparar a configuração e guardar o "antes" de `/planos` para poder comparar sem Git.

- [X] T001 Em `.env.example`, acrescentar a variável `VITE_CONTRATAR_URL` com comentário (endereço do fluxo de contratar, que fica em outro projeto; caminho como `/assinatura/contratar` ou endereço do mesmo domínio; vazio = "Contratar" mostra indisponível). Não mexer nas outras linhas.
- [X] T002 [P] Copiar o arquivo atual `src/features/subscription/screens/public/PublicPlansPage.tsx` para `specs/002-landing-page-publica/baseline/PublicPlansPage.antes.tsx.txt` (cópia só de leitura, para comparação na T007). Copiar também `PublicPlanCard.tsx` e `publicPlansTokens.ts` da mesma pasta, com sufixo `.antes.tsx.txt` / `.antes.ts.txt`.
- [X] T003 [P] Registrar em `specs/002-landing-page-publica/baseline/planos-antes.md` o comportamento atual de `/planos` com `VITE_USAR_DADOS_FALSOS=true`: cabeçalho e subtítulo, seletor (3 opções), colunas da grade nas larguras 1672, 1440, 1024 e 375 px, destaque do Pro, textos dos botões ("Começar grátis" no Free, "Contratar" nos pagos), preços do Pix na periodicidade mensal e na semestral, e o endereço para onde "Contratar" navega (`/assinatura/contratar?plano=…&periodo=…`). Também abrir `/planos?periodo=SEMESTRAL` e anotar que o seletor abre em semestral.
- [ ] T004 **PARADA 1 (revisão do André)**: conferir que as cópias da T002 batem com os arquivos atuais e que o registro da T003 descreve `/planos` como ele está hoje.

---

## Phase 2: Foundational — extrair o PlansCatalog (bloqueia a seção de planos)

**Purpose**: um só componente de planos para `/planos` e para a landing (RF07, FR-007, SC-007). **Nenhuma regra de preço muda; o `PublicPlanCard` não é alterado.** Dependência: Fase 1 concluída.

**Independent Test**: `/planos` continua igual ao registro da T003.

- [X] T005 Criar `src/features/subscription/screens/public/PlansCatalog.tsx` movendo, sem mudar de comportamento, o que hoje está em `PublicPlansPage.tsx`: a periodicidade escolhida (`useState<BillingPeriod>`), o `PeriodSelector`, os estados carregando/erro/vazio (`LoadingState`, `ErrorState`, `EmptyState`), a grade de `PublicPlanCard` (mesmas classes de 1/2/3/5 colunas) e a constante `RECOMMENDED_PLAN = 'PRO'` com seu comentário. Props: `state` (o retorno de `usePlans()`: `data`, `error`, `loading`, `reload`, para cada página chamar `usePlans()` uma vez só e não duplicar a chamada de rede), `onSubscribe(plan: Plan, period: BillingPeriod)`, `initialPeriod?: BillingPeriod` (padrão `MENSAL`), `header?: ReactNode` (entra dentro do bloco `space-y-5 text-center`, antes do seletor) e `notice?: ReactNode` (entra entre o seletor e os estados). Retornar um Fragment, para os filhos continuarem filhos diretos do `main` do layout e manterem o espaçamento atual.
- [X] T006 Editar `src/features/subscription/screens/public/PublicPlansPage.tsx` para usar o `PlansCatalog`: continua chamando `usePlans()`, lendo `?periodo=` (`initialPeriod`), montando o `SubscriptionHeader` ("Planos" + subtítulo, `size="lg"`) como `header`, o aviso "Sua sessão expirou" como `notice` e navegando em "Contratar" para `/assinatura/contratar?plano=${plan.codigo}&periodo=${period}`. Manter `SubscriptionLayout`. Não alterar `PublicPlanCard.tsx`, `publicPlansTokens.ts` nem `PublicPlansRoute.tsx`.
- [X] T007 Conferir por leitura e comparação com `baseline/PublicPlansPage.antes.tsx.txt` que nada saiu de `/planos` (classes, textos, ordem, acessibilidade) e rodar `npm run build` (`tsc --noEmit` + Vite). Conferir também que `PublicPlanCard.tsx` e `publicPlansTokens.ts` estão idênticos às cópias da T002.
- [X] T008 Conferência manual de que `/planos` continua igual (quickstart, cenário 7), com `VITE_USAR_DADOS_FALSOS=true`: comparar com `baseline/planos-antes.md` nas 4 larguras, `?periodo=SEMESTRAL`, troca de periodicidade, destaque do Pro, "Começar grátis" do Free e o endereço de "Contratar". Anotar o resultado ao lado do registro da T003.
- [ ] T009 **PARADA 2 (revisão do André)**: aprovar que `/planos` está igual antes de qualquer arquivo da landing. A única mudança visível em `/planos` vem depois, na T029 (selo do teste, decidido por você), e será conferida na PARADA 3.

---

## Phase 3: As seções da landing (US1, US2, US4 e a seção de planos da US3)

**Purpose**: todas as seções estáticas, em componentes pequenos. Nada fica acessível pela rota `/` ainda (isso é a Fase 4); a revisão desta fase é por leitura, `npm test` e `npm run build`. Dependência: Fase 2 concluída (só a T030 usa o `PlansCatalog`; as demais podem começar sem esperar, mas a PARADA 2 vale para a fase inteira).

**Independent Test**: `npm test` e `npm run build` passam; cada texto da página bate com a spec.

### Base de conteúdo, estilo e testes

- [X] T010 [P] Criar `src/features/landing/content.ts` (sem `import`) com os textos exatos da spec: o título e o subtítulo do topo e a linha "Plano grátis · Teste de 14 dias nos planos Starter e Pro mensais" (FR-002); os 3 cards (FR-004); os 4 blocos com `invertido` alternando falso, verdadeiro, falso, verdadeiro (FR-005); as 5 perguntas e respostas (FR-008); o título, a frase e o botão da chamada final (FR-009); os 4 links âncora com `id` e `label` (`como-funciona`, `recursos`, `planos`, `perguntas`; FR-001); as linhas do exemplo OTLP com os marcadores `<ENDEREÇO_DO_LHAMALOG>` e `<TOKEN_DO_PRODUTO>` (FR-006), guardadas em uma lista separada dos demais textos (para o teste de dígitos da T013 poder excluí-las); e os "Textos de apoio" da tabela da spec (já aprovados pelo André, com a mensagem de "Contratar" indisponível acrescida de "Tente novamente mais tarde."). Copiar os textos literalmente da spec (acentos, pontuação e maiúsculas); não reescrever. O bloco 1 diz "muitas linhas de log" (CHK042).
- [X] T011 [P] Criar `src/features/landing/legalLinks.ts` (sem `import`) com `LEGAL_LINKS = { termos: null, politica: null }` (tipo `string | null`; `null` = desativado com "em breve").
- [X] T012 [P] Criar `src/features/landing/landingTokens.ts` (sem `import`) com as classes de botão (largura própria, mesma altura de 48 px, `motion-safe:` nas transições), de cartão e de seção da landing, reaproveitando só as cores já usadas em `publicPlansTokens.ts`, e exportar a lista de pares texto/fundo usados (para a T014), incluindo o par do texto desativado "em breve" do rodapé (FR-014). Usar só pares já conferidos nos comentários de `publicPlansTokens.ts` ou calculá-los na T014.
- [X] T013 Criar `tests/landing.test.mjs` com testes de `content.ts` e `legalLinks.ts`: os textos de FR-002, FR-004, FR-005, FR-008 e FR-009 iguais à spec; cada `href` de âncora aponta para um `id` existente e cada `id` aparece uma só vez; `LEGAL_LINKS` começa com os dois valores `null`; os textos da página (exceto a lista do exemplo OTLP, que pode ter dígitos como em `/v1/logs`) não têm dígitos além de "14"; não têm "depoimento" nem nome de cliente. (Depende de T010 e T011.)
- [X] T014 [P] Criar `tests/landing-contrast.test.mjs`: calcula a razão de contraste de cada par de `landingTokens.ts` e exige 4,5:1 ou mais (FR-014, SC-005), inclusive para o texto desativado "em breve" (CHK025). (Depende de T012.)
- [X] T015 [P] Em `src/styles.css`, acrescentar a rolagem suave apenas dentro de `@media (prefers-reduced-motion: no-preference)` (FR-011, FR-015). Não mexer nas camadas existentes (`@layer theme, base, clerk, components, utilities`).

### Barra e topo (US1)

- [X] T016 [US1] Criar `src/features/landing/components/FloatingNav.tsx`: barra flutuante arredondada com o logo (`src/shared/assets/lhamalog-logo.svg`), os 4 links âncora, "Entrar" (`/sign-in`) e "Começar grátis" (`/sign-up`); abaixo de 1024 px (`lg`, FR-001; era 768 px, mudou porque os links maiores da barra não cabem antes disso), "Começar grátis" continua visível na barra e "Entrar" vai para o menu compacto, que abre com botão (`aria-expanded`, `aria-controls`), que fecha ao escolher um link e com Esc (FR-001, Edge Cases, 375 px). Foco visível em todos os controles. Rótulos do botão do menu e da navegação: da tabela "Textos de apoio" da spec. (Depende de T010 e T012.)
- [X] T017 [US1] Criar `src/features/landing/components/Hero.tsx`: título grande, subtítulo, botão "Começar grátis" (`/sign-up`), botão "Ver planos" (`#planos`) e a linha de oferta, com os textos de `content.ts` (FR-002). (Depende de T010 e T012.)

### Como funciona, recursos e integração (US2)

- [X] T018 [P] [US2] ~~Criar `OtelStrip.tsx` (faixa "Baseado em OpenTelemetry")~~ **REMOVIDA em 2026-11-10** por decisão do André: a faixa saiu da página, da spec (FR-003 removido), do `content.ts` e dos testes; o arquivo foi apagado.
- [X] T019 [P] [US2] Criar `src/features/landing/components/HowItWorks.tsx`: `<section id="como-funciona">` com os 3 cards, com margem de rolagem maior que a barra (`scroll-mt-*`; FR-004, FR-011).
- [X] T020 [US2] Criar `src/features/landing/components/FeatureBlock.tsx`: texto + tela, com a prop `invertido` trocando o lado só na parte visual (o texto vem antes da tela no código, para a ordem de leitura seguir a ordem visual em qualquer lado; FR-013). A âncora `id="recursos"` fica na seção que contém o título "Recursos" e os 4 blocos (no `LandingPage.tsx`), com margem de rolagem maior que a barra (`scroll-mt-*`; FR-005, FR-011).
- [X] T021 [P] [US2] Criar `src/features/landing/components/mocks/OccurrencesMock.tsx`: tela de ocorrências agrupadas, montada com HTML/CSS, dados fictícios, sem imagens. `role="img"` com `aria-label` do texto de leitor de tela da tabela "Textos de apoio" da spec, interior `aria-hidden`, legenda visível "Exemplo ilustrativo" (FR-020).
- [X] T022 [P] [US2] Criar `src/features/landing/components/mocks/AiSuggestionMock.tsx`: tela de sugestão de causa por IA, mesmas regras da T021.
- [X] T023 [P] [US2] Criar `src/features/landing/components/mocks/MaskedDataMock.tsx`: tela com valores fictícios já mascarados, nunca dados reais (US2, cenário 3); mesmas regras da T021.
- [X] T024 [P] [US2] Criar `src/features/landing/components/mocks/AlertsMock.tsx`: tela de aviso para a equipe (e-mail ou push), mesmas regras da T021.
- [X] T025 [US2] Criar `src/features/landing/components/IntegrationSection.tsx`: bloco `<pre><code>` com o título e a introdução da tabela "Textos de apoio" da spec e o exemplo OTLP de `content.ts`, texto selecionável, com quebra ou rolagem **dentro do bloco** para não gerar rolagem lateral na página em 375 px (FR-006, FR-012). Sem botão de copiar.

### Perguntas, chamada final e rodapé (US4)

- [X] T026 [P] [US4] Criar `src/features/landing/components/Faq.tsx`: `<section id="perguntas">` com margem de rolagem maior que a barra (`scroll-mt-*`; FR-011) e `<details>`/`<summary>` nativos para as 5 perguntas; abrir/fechar por teclado; o estado aberto ou fechado de cada pergunta é anunciado por leitor de tela (FR-013); animação só com `motion-safe:` (FR-008, FR-013, FR-015).
- [X] T027 [P] [US4] Criar `src/features/landing/components/FinalCta.tsx`: título "Comece a entender suas falhas", a frase e o botão "Começar grátis" (`/sign-up`) de `content.ts` (FR-009).
- [X] T028 [US4] Criar `src/features/landing/components/Footer.tsx`: "Termos de Uso" e "Política de Privacidade" lendo `LEGAL_LINKS`; com `null`, texto desativado (`aria-disabled="true"`) com "em breve" visível e anunciado; com endereço, link ativo (`target="_blank"` e `rel="noopener noreferrer"`), sem mudar o layout; o texto "em breve" usa a cor do par conferido na T014, com contraste de 4,5:1 (FR-009, FR-014, US4 cenários 2 e 3). (Depende de T011.)

### Seção de planos (US3)

- [ ] T029 [US3] Restringir o selo do teste no card (CHK038, decisão do André, FR-022, [research.md](research.md) item 14): em `src/features/subscription/screens/public/PublicPlanCard.tsx`, o selo "Teste grátis de {n} dias" só aparece quando `isTrialAvailable(plan, period, 'CARTAO')` (de `src/features/subscription/subscriptionRules.ts`) for verdadeiro, no lugar de `plan.testeGratisDias !== null`. Manter a linha reservada do selo (altura mínima nas colunas lado a lado) para as listas não se desalinharem. Esta é a **única mudança visível em `/planos`**, e vale para a landing também. Em `tests/landing.test.mjs`, acrescentar: (1) tabela de verdade de `isTrialAvailable` (Starter e Pro mensal no cartão = verdadeiro; semanal, semestral, Pix, débito, boleto, Business, Enterprise e Free = falso); (2) checagem por leitura do arquivo de que `PublicPlanCard.tsx` chama `isTrialAvailable` e não usa `testeGratisDias !== null` para decidir o selo. Conferir em `/planos` nas 3 periodicidades (quickstart, cenário 17) e anotar ao lado do registro da T003 que o selo mudou de propósito. (Depende de T005, T006 e T013.)
- [ ] T030 [US3] Criar `src/features/landing/components/PlansSection.tsx`: `<section id="planos">` com `scroll-mt-*`, largura até 1600 px como em `/planos`, `usePlans()` chamado uma vez e passado ao `PlansCatalog` (`header` com o título e a introdução da tabela "Textos de apoio" da spec, `initialPeriod` mensal); recebe `onSubscribe` por prop. Nesta fase o `onSubscribe` ainda não faz nada (a landing não está na rota); a ligação com o "Contratar" é a T040. (Depende de T005 e T029.)

### Montagem e conferência

- [ ] T031 Criar `src/features/landing/LandingPage.tsx`: monta, nesta ordem, `FloatingNav`, `Hero`, `HowItWorks`, os 4 `FeatureBlock` (com as telas T021 a T024), `IntegrationSection`, `PlansSection`, `Faq`, `FinalCta` e `Footer`; importa a fonte Poppins como `SubscriptionLayout` já faz; usa `<main>` e `lang="pt-BR"` já definido na página (conferir `index.html`). Passa a `PlansSection` um `onSubscribe` provisório vazio (trocado na T040).
- [ ] T032 Rodar `npm test` e `npm run build` e corrigir o que falhar nos arquivos novos. Conferir por leitura que nenhuma imagem, logo de cliente, número de clientes, depoimento ou resultado existe nos arquivos de `src/features/landing/`. Conferência manual contra a referência citada na spec (FR-017): os textos, as imagens e os números da landing não podem ser iguais aos da referência.
- [ ] T033 **PARADA 3 (revisão do André)**: revisar as seções por leitura (ainda sem a rota). Aprovar antes da Fase 4.

---

## Phase 4: Rota "/" (US5) e primeira conferência visual (US1, US2, US4)

**Purpose**: colocar a landing em `/` sem mexer em Clerk. Dependência: Fase 3 concluída.

**Independent Test**: visitante vê a landing; pessoa logada vai a `/empresa`; durante a verificação não aparece nenhuma das duas.

- [ ] T034 [US5] Criar `src/features/landing/LandingRoute.tsx` no mesmo padrão de `PublicPlansRoute.tsx`: com `fakeDataEnabled`, abre `LandingPage` direto; senão usa `useAuth()` (somente leitura): `!isLoaded` mostra o `LoadingState` já existente com o texto de carregamento da tabela "Textos de apoio" da spec (sem landing e sem área interna, nunca tela em branco); se a verificação passar de 5 segundos (proposta; o André confirma na PARADA 4) ou falhar, mostra a landing ao visitante (FR-021), `isSignedIn` leva a `/empresa` com `<Navigate replace />`, e o resto mostra `LandingPage` (FR-010, SC-009). Não importar nada de configuração da Clerk além de `useAuth`.
- [ ] T035 [US5] Em `src/app/routes/AppRoutes.tsx`, **remover a rota temporária `/landing-teste`** (criada na T016 a T024 só para ver a landing no navegador) e trocar a rota `/` (hoje `<Navigate to="/empresa" replace />`) por `<LandingRoute />`. Não alterar nenhuma outra rota (a rota `*` continua indo para `/`).
- [ ] T036 [US1] [US2] [US4] Conferência manual com `VITE_USAR_DADOS_FALSOS=true` (quickstart, cenários 1, 2, 3, 8, 9, 10, 11, 13 e 19): topo, ordem das seções, âncoras com o título visível, rodapé desativado, 1672/1440/1024/375 px (script da largura da página mais conferência visual, cenário 9), até 2 cliques até o cadastro (cenário 19), só teclado (inclui menu compacto, Esc e sanfona), movimento reduzido e busca por números/clientes/depoimentos. Anotar o que falhar.
- [ ] T037 **PARADA 4 (revisão do André)**: ver a página em `/` e aprovar antes de ligar o "Contratar".

---

## Phase 5: "Contratar" (US3)

**Purpose**: levar plano e periodicidade ao cadastro, sem decidir nada do teste de 14 dias. Dependência: Fase 4 concluída.

**Independent Test**: o endereço gerado bate com a tabela de [data-model.md](data-model.md); sem configuração, aparece a mensagem de indisponibilidade.

- [ ] T038 [US3] Criar `src/features/landing/contractLink.ts` (sem `import`, sem `import.meta.env`): `buildContractLink({ plano, periodo, contratarUrl, origem })` devolve `/sign-up?redirect_url=` + codificação de `<contratarUrl>?plano=<plano>&periodo=<periodo>`, ou `null` quando: `contratarUrl` vazio; `contratarUrl` de outro domínio (só caminho começando com `/` ou o mesmo domínio de `origem`); esquema que não seja http/https; `periodo` fora de `SEMANAL`, `MENSAL`, `SEMESTRAL` (data-model.md, "Destino do Contratar").
- [ ] T039 [US3] Em `tests/landing.test.mjs`, acrescentar os testes de `buildContractLink`: caminho relativo válido; mesmo domínio válido; outro domínio recusado; esquema inválido recusado; `contratarUrl` vazio; período inválido; codificação correta de `plano` e `periodo`. (Depende de T038.)
- [ ] T040 [US3] Em `src/features/landing/LandingPage.tsx` e `PlansSection.tsx`, ligar o `onSubscribe` ao `buildContractLink` com `import.meta.env.VITE_CONTRATAR_URL` e `window.location.origin` (lidos no componente, não no módulo puro): quando houver endereço, `navigate` para ele; quando for `null`, mostrar uma mensagem de indisponibilidade na própria seção (`role="alert"`, texto da tabela "Textos de apoio" da spec, sem quebrar a página e sem levar a endereço inválido). O "Começar grátis" do card Free continua indo a `/sign-up` (já é assim no card). (Depende de T038.)
- [ ] T041 [US3] Conferência manual (quickstart, cenários 4, 5, 6 e 14): valores iguais aos de `/planos` em todas as periodicidades; "Contratar" Starter semestral gera o endereço esperado; com `VITE_CONTRATAR_URL` vazio aparece a mensagem; com Clerk real (chave do André), conferir que o endereço de retorno sobrevive à troca de cadastro para login. **O que não puder ser testado (Clerk, rota `/assinatura/contratar` do outro projeto) fica registrado como "não testado".**
- [ ] T042 **PARADA 5 (revisão do André)**: aprovar o "Contratar" e o registro do que ficou sem teste.

---

## Phase 6: Polish e fechamento

**Purpose**: fechar a conferência e as pendências de consistência. Dependência: Fase 5 concluída.

- [ ] T043 Rodar o quickstart inteiro ([quickstart.md](quickstart.md), 19 cenários) e registrar o resultado de cada um (passou, falhou, não testado) em `specs/002-landing-page-publica/quickstart-resultados.md`. Rodar `npm test` e `npm run build` uma última vez.
- [ ] T044 Conferir por leitura que `plan.md`, `data-model.md`, `research.md`, `contracts/ui-contract.md` e `quickstart.md` não dizem mais "rascunho a aprovar" nem "cadastro ou login" e concordam com a spec (FR-010, FR-019 a FR-022). As correções de CHK035 e CHK036 já foram feitas; esta tarefa só confirma que nada voltou e registra o resultado em `specs/002-landing-page-publica/quickstart-resultados.md`.
- [ ] T045 Repetir a comparação da T007 e a conferência da T008 (`/planos` igual ao registro da T003), agora com a landing completa. O `PublicPlanCard.tsx` não precisa ser idêntico à cópia da T002: a única diferença aceita é a do selo do teste da T029 (`isTrialAvailable`); `PublicPlansPage.tsx` e `publicPlansTokens.ts` continuam comparados com as cópias.
- [ ] T046 **PARADA final (revisão do André)**: aprovar a entrega. Itens que continuam com o André: confirmação do PO da regra de cancelamento (Assumptions da spec), endereço público do Collector para o exemplo OTLP, endereços dos Termos e da Política (`LEGAL_LINKS`) e valor de `VITE_CONTRATAR_URL`.

---

## Dependências entre fases

```text
Fase 1 (Setup) → Fase 2 (PlansCatalog) → Fase 3 (seções) → Fase 4 (rota "/") → Fase 5 ("Contratar") → Fase 6 (fechamento)
                                          ↑ T029 (selo do teste no card) antes de T030
```

- A Fase 2 bloqueia a T030 (a seção de planos usa o `PlansCatalog`) e a PARADA 2 bloqueia o resto.
- Dentro da Fase 3: T010, T011 e T012 antes de T013, T014, T016 e T017; T020 antes de T021 a T024 só no encaixe (as telas são independentes entre si); T029 antes de T030; T031 depende de todas as anteriores da fase.
- A Fase 5 depende da Fase 4 porque a conferência precisa da página aberta em `/`.

## Oportunidades de paralelismo

- Fase 1: T002 e T003.
- Fase 3: T010, T011, T012 e T015 juntas; depois T014; T018, T019, T021 a T024, T026 e T027 juntas (arquivos diferentes).
- Nenhuma tarefa de fase diferente roda em paralelo, por causa das PARADAS.

## Estratégia de implementação

- **MVP**: Fases 1 a 4 entregam a landing visível em `/`, com topo, seções e "Começar grátis". A US1 (P1) fica completa na PARADA 4. O "Contratar" real (Fase 5) é a US3 completa.
- Entrega em pequenas partes, com revisão do André em cada PARADA. Se uma conferência falhar, corrigir na mesma fase antes de seguir.
- **Itens abertos que não viram tarefa (fora do escopo desta lista)**: os demais itens do checklist [qualidade.md](checklists/qualidade.md) que pedem decisão de requisito (por exemplo CHK011, CHK012, CHK042, CHK045). Eles não bloqueiam as tarefas, mas o `/speckit-implement` lê o estado do checklist e pode parar enquanto os itens estiverem desmarcados.

## Resumo

- 46 tarefas (6 delas são PARADAS).
- Por fase: Setup 4, PlansCatalog 5, Seções 24, Rota "/" 4, "Contratar" 5, Fechamento 4.

## Fase 7: Paleta, botões animados e janela dos logs (2026-11-12)

**Objetivo**: FR-018 (paleta da marca), FR-023 e FR-024 (janela dos logs no topo) e FR-025 (botões animados). Sem pacote novo, sem Git.

- [x] T047 Atualizar `landingTokens.js`, `publicPlansTokens.js` e `shared/ui/Button.jsx` com a paleta (#0D65D9 nos botões, #033473 nos títulos, #F2F2F2 no fundo de seção) e os pares de contraste novos (FR-018, FR-014)
- [x] T048 Animação discreta dos botões cheios e de contorno, só com `motion-safe:` (FR-025)
- [x] T049 [P] Mover os exemplos fictícios da IA para `mocks/aiExamples.js` (o bloco 2 continua igual)
- [x] T050 [P] `LOG_LINES` e os rótulos de pausa em `content.js` (textos aprovados na spec)
- [x] T051 Criar `mocks/LogStreamMock.jsx` (FR-023, FR-024, FR-015) e usar no `Hero.jsx` (FR-002)
- [x] T052 Fundo #F2F2F2 nas seções "Como funciona" e "Perguntas frequentes"
- [x] T053 Atualizar os testes (textos, topo, contraste, cor dos botões) e rodar `npm test` e `npm run build`
- [x] T054 Conferir no navegador: ciclo completo, pausar e retomar pelo mouse e pelo teclado, movimento reduzido, 375 e 1440 px sem rolagem lateral (SC-003, SC-006, SC-010). Feito em 12/11 pelo Docker: ciclo, pausa/retomada (foco por teclado), 375 px e tela larga sem rolagem lateral. O movimento reduzido foi conferido só pelo teste do código (o navegador de teste não simula a preferência)
- [ ] T055 PARADA 7: revisão do André

## Fase 8: Fundos, texto, chamada final e rodapé (2026-11-12)

**Objetivo**: FR-009 (revisado), FR-026 e FR-027. Sem pacote novo, sem Git.

- [x] T056 Fundos alternados branco e #F2F2F2 nas seções do meio (FR-026)
- [x] T057 Parágrafos em #141826 com 18 px; introduções de seção maiores (FR-026)
- [x] T058 Chamada final com fundo #141826, sem brilhos, frase em branco e maior (FR-009)
- [x] T059 Rodapé escuro: logo maior, ícones de redes (`socialLinks.js`, só GitHub com endereço), "©" e Termos e Política como texto simples (FR-009, FR-027)
- [x] T060 Atualizar os testes (rodapé, ano do "©", contraste dos pares novos) e rodar `npm test` e `npm run build`
- [x] T061 Conferir no navegador (tela larga e 375 px, sem rolagem lateral)
- [x] T062a Ajuste do André: uma só linha no rodapé e logo para fundo escuro (`lhamalog-logo-escuro.svg`)
- [x] T062b Tela de Ocorrências do bloco 1 no estilo do Figma (`OccurrencesMock.jsx`, barra lateral e lista)
- [x] T062c Moldura do sistema (`SystemShell.jsx`) nas telas de sugestão por IA, dados mascarados e alertas
- [ ] T062 PARADA 8: revisão do André
