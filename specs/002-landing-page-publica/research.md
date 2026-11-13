# Research: Landing page pública do LhamaLog

Nenhum item ficou como NEEDS CLARIFICATION. As decisões abaixo foram tiradas da leitura do código atual e do pedido.

## 1. Reaproveitar os planos sem duplicar regra

- **Decision**: extrair de `PublicPlansPage` um componente `PlansCatalog` (seletor de periodicidade + estados carregando/erro/vazio + grade de `PublicPlanCard`) que recebe `onSubscribe`. `/planos` e a landing usam o mesmo componente.
- **Rationale**: o preço sai pronto do Core (`planPrice`) e o destaque do Pro (`RECOMMENDED_PLAN`) mora na página; extrair mantém uma fonte só. O `PublicPlanCard` não muda.
- **Alternatives**: (a) copiar a grade: duplica regra, rejeitado; (b) renderizar `PublicPlansPage` inteira dentro da landing: traz o `SubscriptionLayout` (cabeçalho/logo duplicado) e o cabeçalho "Planos", rejeitado.
- **Cuidado**: `PublicPlansPage` lê `?periodo=` da URL; na landing a periodicidade inicial é `MENSAL` (a URL `/` não leva esse parâmetro). `PlansCatalog` recebe `initialPeriod` opcional.

## 2. Botão "Contratar" da landing

- **Decision**: `contractLink.ts` (função pura) recebe `{ plano, periodo, contratarUrl }` e devolve o caminho de entrada: `/sign-up?redirect_url=<contratarUrl>?plano=…&periodo=…` (valores codificados). O "Contratar" só chama `navigate`. `contratarUrl` vem de `import.meta.env.VITE_CONTRATAR_URL`. Se a variável estiver vazia ou inválida, devolve `null` e a tela mostra a mensagem de indisponibilidade (spec, User Story 3, cenário 4).
- **Rationale**: o fluxo de contratar fica em outro projeto (`tela-interna-sistema`, rota `/assinatura/contratar`); a landing só entrega plano e periodicidade. A página `/planos` hoje já navega para `/assinatura/contratar?plano=…&periodo=…`, então o formato da consulta é o mesmo.
- **Cadastro (FR-010)**: o destino é sempre `/sign-up`; quem já tem conta entra pelo link da própria tela de cadastro (a spec fixa esta escolha). A Clerk mantém o `redirect_url` ao trocar de cadastro para login. **Precisa conferir no quickstart** (não dá para provar sem a chave da Clerk).
- **Risco (FR-019)**: a Clerk só aceita `redirect_url` de origens permitidas. Por isso `contractLink.ts` aceita só caminho relativo (começa com `/`) ou o mesmo domínio da página; endereço de outro domínio é recusado (vira "indisponível"), o que também evita redirecionamento aberto.
- **Alternatives**: ir para `/sign-in` (rejeitado: pior para quem é novo); guardar a escolha em `sessionStorage` (rejeitado: o pedido é levar no `redirect_url`).

## 3. Rota `/` e quem já está logado

- **Decision**: `LandingRoute` usa `useAuth()` (somente leitura). `isLoaded && isSignedIn` → `<Navigate to="/empresa" replace />`; `!isLoaded` → indicador de carregamento (sem landing e sem área interna, nunca tela em branco); se a verificação passar de um tempo limite (proposta: 5 segundos, o André confirma na PARADA 4) ou falhar → landing para o visitante (FR-021); senão a landing. Com `fakeDataEnabled` (desenvolvimento sem Clerk) abre a landing direto, igual a `PublicPlansRoute`.
- **Rationale**: `/` hoje redireciona para `/empresa`; mantém o destino atual. Sessão "pending" (MFA ainda não feito) conta como deslogada nesta aplicação, então vê a landing (coerente com `ProtectedRoute`).
- **Alternatives**: levar a `/assinatura/planos` como `/planos` faz (rejeitado: `/` é a porta de entrada geral do sistema, não só de planos).

## 4. Âncoras e rolagem

- **Decision**: links `<a href="#como-funciona">` etc. nativos, com `id` nas seções e `scroll-margin-top` maior que a altura da barra. Rolagem suave por CSS em `@media (prefers-reduced-motion: no-preference)` no `styles.css`.
- **Rationale**: o `BrowserRouter` não atrapalha links de hash; sem JavaScript de rolagem, o teclado e o botão voltar funcionam como no navegador.
- **Alternatives**: `scrollIntoView` em JS (rejeitado: mais código e precisa tratar movimento reduzido à mão).

## 5. Menu no celular (375 px)

- **Decision**: abaixo de `md` os 4 links âncora vão para um menu compacto (botão com `aria-expanded` e `aria-controls`; fecha ao escolher um link ou com Esc). "Entrar" e "Começar grátis" ficam sempre visíveis na barra (ou o "Entrar" entra no menu se faltar espaço).
- **Rationale**: a barra flutuante arredondada não cabe com 4 links + 2 botões em 375 px sem rolagem lateral.

## 6. Perguntas frequentes em sanfona

- **Decision**: `<details>`/`<summary>` nativos. Teclado (Enter/Espaço), anúncio de estado e foco já vêm do navegador. A animação de abrir é opcional e só em CSS com `motion-safe`.
- **Alternatives**: botões com `aria-expanded` e JS (rejeitado: mais código para o mesmo resultado).

## 7. Telas do produto em HTML/CSS

- **Decision**: 4 componentes de tela (ocorrências, sugestão por IA, dados mascarados, alertas) com cartões, linhas e selos do próprio Tailwind, dados fictícios óbvios (nomes de serviço como `servico-pagamentos`, horários e contagens de exemplo). Cada tela traz a legenda visível "Exemplo ilustrativo" (FR-020) e recebe `role="img"` e um `aria-label` que descreve o conteúdo; o interior fica `aria-hidden` (não é conteúdo para ler linha a linha).
- **Rationale**: spec FR-005 e FR-016. Os números das telas (contagens de ocorrências, horários) são exemplos de interface, não resultado; o plano marca a legenda "Exemplo ilustrativo" em cada tela para não parecerem dado real.
- **Alternatives**: imagens/capturas (proibido pela spec).

## 8. Exemplo de configuração OTLP

- **Decision**: bloco `<pre><code>` estático com as variáveis padrão do OpenTelemetry (`OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_EXPORTER_OTLP_HEADERS` com `Authorization=Bearer <TOKEN_DO_PRODUTO>`). O endereço vem como marcador (`<ENDEREÇO_DO_LHAMALOG>`), sem domínio inventado; o token é sempre marcador. O Collector recebe em `/v1/logs` (HTTP 4318).
- **Rationale**: o endereço público do Collector ainda não existe/está definido; marcador não promete nada falso. Sem botão de copiar nesta entrega (evita permissão de área de transferência); texto selecionável.
- **Alternatives**: botão "Copiar" (adiado; não está nos RFs).

## 9. Termos e Política "em breve"

- **Decision**: `legalLinks.ts` exporta `LEGAL_LINKS = { termos: null, politica: null }` (constante única). O rodapé renderiza link ativo se o valor for preenchido e, se for `null`, um texto desativado (`aria-disabled="true"`) com "em breve" visível. Endereço externo abre em nova aba com `rel="noopener noreferrer"`.
- **Rationale**: decisão da pergunta 4 da clarificação.

## 10. Estilo e tokens

- **Decision**: `landingTokens.ts` próprio, reaproveitando só os valores de cor já adotados (#033473, #0C70F2, #083B7A, #141826, #F3F7FD, #D2E1F6) e a fonte Poppins já importada pelo `SubscriptionLayout`. Não se reaproveita `publicButton` porque ele é `w-full` (feito para o cartão); a landing precisa de botões com largura própria.
- **Contraste**: usar apenas os pares já conferidos em `publicPlansTokens.ts` (ex.: branco sobre #0C70F2 = 4,6:1; #141826 sobre #F3F7FD = 16:1; slate-700 sobre branco ≥ 7:1). Pares novos serão calculados por script no quickstart.

## 11. Animações

- **Decision**: somente classes `motion-safe:` do Tailwind (transições de cor, leve subida ao passar o mouse, aparecer ao abrir a sanfona). Nenhuma animação disparada por JavaScript, nenhum "aparecer ao rolar" (evita conteúdo escondido sem movimento e a dependência de `IntersectionObserver`).

## 12. Textos ainda não confirmados

- **Perguntas frequentes**: os 5 textos foram aprovados pelo André na clarificação de 2026-11-10 (ver spec.md, FR-008) e entram em `content.ts` exatamente como estão. Falta só a confirmação do PO da regra de cancelamento ("segue ativa até o fim do período já pago").
- **Chamada final**: título e frase aprovados pelo André em 2026-11-10 (spec.md, FR-009); entram em `content.ts` exatamente como estão.
- **Metas do projeto**: a página não cita nenhuma meta (a spec só permite se marcadas como "meta"; não citar é a opção mais segura e não perde requisito).

## 13. Testes sem biblioteca nova

- **Decision**: testar com `node --test` apenas lógica pura: `contractLink` (casos válidos, variável ausente, destino de outro domínio, codificação), `legalLinks` (nulo → desativado), e `content` (textos exatos da spec, sem dígitos de "clientes", sem a palavra "depoimento"). Telas: `tsc` + build + roteiro manual nas 4 larguras + checagem de contraste por script.

## 14. Selo "Teste grátis de 14 dias" (FR-022)

- **Decision**: o `PublicPlanCard` mostra o selo só quando `isTrialAvailable(plan, period, 'CARTAO')` (já existe em `src/features/subscription/subscriptionRules.ts`: `testeGratisDias === 14`, periodicidade mensal e cartão) for verdadeiro. A mudança vale para `/planos` e para a landing, porque os dois usam o mesmo card. O espaço reservado para o selo (linha de altura mínima nas colunas lado a lado) continua, para as listas não se desalinharem.
- **Rationale**: decisão do André (checklist CHK038): sem isso o card mostrava o selo em semanal e semestral, contradizendo a linha do topo e a resposta das perguntas frequentes ("Starter e Pro mensais"). O cartão é a única forma que dá o teste; o preço mostrado no card continua sendo o do Pix.
- **Alternatives**: manter o selo como estava (rejeitado pelo André); esconder o selo só na landing (rejeitado: deixaria as duas páginas diferentes).
- **Prova**: teste em `tests/landing.test.mjs` com a tabela de verdade de `isTrialAvailable` e uma checagem de que `PublicPlanCard.tsx` chama `isTrialAvailable` (não decide o selo por `testeGratisDias !== null`).
