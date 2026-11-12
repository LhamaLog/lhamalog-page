# Implementation Plan: Landing page pública do LhamaLog

**Branch**: `002-landing-page-publica` (sem Git; só referência) | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-landing-page-publica/spec.md`

## Summary

Criar a landing page pública na rota `/` com 8 seções estáticas (barra flutuante, topo, "Como funciona", 4 blocos de recursos com telas montadas em HTML/CSS, integração OTLP, planos, perguntas frequentes, chamada final e rodapé). A seção de planos **reaproveita** o que `/planos` já tem: o hook `usePlans`, o seletor de periodicidade, o `PublicPlanCard` e o `format.ts`. Para isso, a grade de planos de `PublicPlansPage` é extraída para um componente compartilhado (`PlansCatalog`), usado pelas duas páginas, e a regra de preço continua só no Core/mocks. "Contratar" monta o endereço de retorno com plano e periodicidade e leva ao cadastro (quem já tem conta entra pelo link da própria tela de cadastro); o destino do fluxo de contratar vem de variável de ambiente e só é aceito se for do mesmo site. O selo "Teste grátis de 14 dias" do card passa a aparecer só quando `isTrialAvailable` é verdadeiro (Starter ou Pro, mensal, cartão), na landing e em `/planos`. Quem está logado e abre `/` vai para `/empresa` (comportamento atual de `/`). Termos e Política ficam desativados com "em breve", com os endereços em uma constante única. Nada de pacote novo, nada em Clerk, nada de Git.

## Technical Context

**Language/Version**: TypeScript 7.0.2, React 19.3.1 (Node 26.12.1)

**Primary Dependencies**: React Router 7.18.4, Tailwind 4.3.3 (via `@tailwindcss/vite`), `@clerk/react` 6.18.2 (só `useAuth`, já usado), `@fontsource/poppins`. **Nenhum pacote novo.**

**Storage**: N/A (conteúdo fixo em arquivo; planos vêm do hook existente)

**Testing**: `node --test tests/*.test.mjs` (módulos TS puros, sem JSX) + `npm run build` (`tsc --noEmit` + Vite) + roteiro manual do [quickstart.md](quickstart.md) nas 4 larguras. Sem biblioteca de teste de componente (não instalar).

**Target Platform**: navegadores modernos (desktop e celular), página pública estática dentro do SPA

**Project Type**: web (front-end SPA, `lhamalog-web`)

**Performance Goals**: sem meta numérica própria; página estática, sem imagens de terceiros, sem biblioteca de animação, só uma chamada de rede (a lista de planos, que já existe)

**Constraints**: sem rolagem lateral em 1672/1440/1024/375 px; teclado; contraste ≥ 4,5:1; animação só com `motion-safe`; sem número/cliente/depoimento inventado; não mexer em Clerk nem instalar npm; sem Git; tempo limite da verificação de sessão: 5 segundos (proposta do plano para o FR-021; o André confirma na PARADA 4)

**Scale/Scope**: 1 rota, ~14 componentes pequenos, 1 refatoração pequena em arquivo existente

## Constitution Check

`.specify/memory/constitution.md` ainda é o modelo em branco (sem princípios ratificados). Gates tirados das regras do projeto (`docs/instrucoes-agentes.md`, `README.md`) e do pedido:

| Gate | Situação |
|---|---|
| Sem Git, sem branch, sem PR | Passa (nenhum comando Git no plano) |
| Não alterar Clerk/autenticação | Passa: só `useAuth` (leitura) e rotas `/sign-in` e `/sign-up` existentes |
| Não instalar dependências | Passa |
| Preservar o que existe | Passa com cuidado: as únicas mudanças em arquivos existentes de planos são extrair a grade e restringir o selo do teste (ver Complexity Tracking) |
| Pequenas entregas com parada para revisão | Passa: tasks.md terá fases com parada |
| Sem texto inventado | Passa: todos os textos, inclusive as perguntas frequentes, são texto aprovado na spec (FR-008, FR-009) |

Reavaliação após o desenho (Fase 1): sem violações.

## Project Structure

### Documentation (this feature)

```text
specs/002-landing-page-publica/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
├── checklists/requirements.md
└── tasks.md              # criado por /speckit-tasks (não por este comando)
```

### Source Code (repository root)

```text
src/
├── app/routes/AppRoutes.tsx                     # EDITA: "/" passa a usar LandingRoute
├── styles.css                                   # EDITA: rolagem suave só com movimento permitido
├── features/
│   ├── landing/                                 # NOVO
│   │   ├── LandingRoute.tsx                     # decide: logado → /empresa; carregando → neutro; visitante → página
│   │   ├── LandingPage.tsx                      # monta as seções na ordem
│   │   ├── content.ts                           # textos exatos da spec + perguntas frequentes
│   │   ├── contractLink.ts                      # monta o endereço do "Contratar" (puro, testável)
│   │   ├── legalLinks.ts                        # constante única dos endereços de Termos e Política
│   │   ├── landingTokens.ts                     # classes de botão/cartão da landing (cores já usadas em /planos)
│   │   └── components/
│   │       ├── FloatingNav.tsx                  # barra flutuante + menu compacto no celular
│   │       ├── Hero.tsx
│   │       ├── HowItWorks.tsx
│   │       ├── FeatureBlock.tsx                 # texto + tela, com o lado invertido
│   │       ├── mocks/                           # telas em HTML/CSS com dados fictícios
│   │       │   ├── OccurrencesMock.tsx
│   │       │   ├── AiSuggestionMock.tsx
│   │       │   ├── MaskedDataMock.tsx
│   │       │   └── AlertsMock.tsx
│   │       ├── IntegrationSection.tsx
│   │       ├── PlansSection.tsx                 # usa PlansCatalog; só traz o "Contratar" da landing
│   │       ├── Faq.tsx                          # sanfona com <details>/<summary>
│   │       ├── FinalCta.tsx
│   │       └── Footer.tsx
│   └── subscription/screens/public/
│       ├── PlansCatalog.tsx                     # NOVO: seletor + estados + grade (extraído de PublicPlansPage)
│       ├── PublicPlansPage.tsx                  # EDITA: passa a usar PlansCatalog (mesmo resultado na tela)
│       └── PublicPlanCard.tsx                   # EDITA: selo do teste só com isTrialAvailable (FR-022)
.env.example                                     # EDITA: VITE_CONTRATAR_URL
tests/landing.test.mjs                           # NOVO: contractLink, legalLinks, content, selo do teste
tests/landing-contrast.test.mjs                  # NOVO: contraste dos pares de cor da landing
specs/002-landing-page-publica/baseline/          # NOVO: cópias "antes" de /planos e registro do comportamento
specs/002-landing-page-publica/quickstart-resultados.md  # NOVO: resultado de cada cenário do quickstart
```

**Structure Decision**: segue o padrão existente (`src/features/<área>/` com telas e regras puras em arquivos `.ts` testáveis por `node --test`). A landing fica em `features/landing` e só importa de `features/subscription` (nunca o contrário).

## Mudanças de 2026-11-12 (FR-018, FR-023, FR-024 e FR-025)

Feitas na cópia do `lhamalog-page` (JavaScript, sem Clerk e sem React Router; ver `NOTA-ADAPTACAO.md`). **Nenhum pacote novo**: a animação usa só React (estado e temporizadores) e transições CSS do Tailwind com `motion-safe:`.

| Arquivo | O que muda |
|---|---|
| `src/features/landing/landingTokens.js` | Paleta da marca: botões cheios em `#0D65D9` (mouse em cima `#0B57BD`, 6,75:1), títulos em `#033473`, links e contorno em `#0D65D9`, fundo de seção `#F2F2F2`; animação discreta dos botões (FR-025); pares de contraste novos da janela dos logs |
| `src/features/subscription/screens/public/publicPlansTokens.js`, `src/shared/ui/Button.jsx` | Mesmo azul de botão `#0D65D9`, para os botões dos planos e de "tentar de novo" seguirem a paleta |
| `src/features/landing/content.js` | `LOG_LINES` (linhas aprovadas) e os rótulos "Pausar animação" e "Retomar animação" em `SUPPORT_TEXTS` |
| `src/features/landing/components/mocks/aiExamples.js` (NOVO) | Os dois exemplos fictícios da IA saem do `AiSuggestionMock` para um arquivo próprio, usado pelo bloco 2 e pela janela dos logs |
| `src/features/landing/components/mocks/LogStreamMock.jsx` (NOVO) | Janela escura `#141826`: linhas descendo, erro em destaque, causa e correção da IA, pausa e recomeço (FR-023); botão de pausar fora da área lida como imagem (FR-024); com movimento reduzido, mostra o resultado parado e sem botão (FR-015); para de animar quando sai da tela (IntersectionObserver), para não gastar processamento |
| `src/features/landing/components/Hero.jsx` | Troca a tela estática pela `LogStreamMock` |
| `src/features/landing/components/HowItWorks.jsx`, `Faq.jsx` | Fundo `#F2F2F2` |
| `tests/` | Linhas dos logs e rótulos iguais à spec; topo usa `LogStreamMock`; contraste dos pares novos; botões em `#0D65D9` |

**Desempenho (skill animation-performance):** só `transform` e `opacity` são animados; a altura da janela é fixa, então o ciclo não empurra a página; os temporizadores param com a pausa, fora da tela e ao desmontar.

## Mudanças de 2026-11-12, parte 2 (FR-009 revisado, FR-026 e FR-027)

| Arquivo | O que muda |
|---|---|
| `landingTokens.js` | `landingText.body` e `sectionIntro` em #141826 e maiores; pares de contraste do rodapé escuro e da chamada final; sai o par do "em breve" |
| `LandingPage.jsx`, `HowItWorks.jsx`, `IntegrationSection.jsx`, `PlansSection.jsx`, `Faq.jsx` | Fundo de cada seção na alternância branco / #F2F2F2 |
| `Hero.jsx` | Subtítulo e linha de oferta em #141826 |
| `FinalCta.jsx` | Fundo #141826, sem brilhos, frase branca maior |
| `socialLinks.js` (NOVO) | Ponto único dos endereços das redes (só o GitHub preenchido) |
| `components/SocialIcons.jsx` (NOVO) | Ícones em SVG próprio (sem pacote de ícones) |
| `Footer.jsx`, `content.js`, `legalLinks.js` | Rodapé escuro: logo maior, redes, "©", Termos e Política como texto simples; `FOOTER.emBreve` sai |

## Complexity Tracking

| Mudança | Por que é necessária | Alternativa mais simples rejeitada porque |
|---|---|---|
| Extrair `PlansCatalog` de `PublicPlansPage` (arquivo existente de `/planos`) | RF07 exige reaproveitar cards e seletor "sem duplicar regra"; hoje a grade, o seletor e os estados vivem dentro da página | Copiar a grade para a landing duplicaria o destaque do Pro, os estados de carregando/erro/vazio e a regra de 1/2/3/5 colunas; qualquer ajuste em `/planos` deixaria de valer na landing |
| Restringir o selo do teste no `PublicPlanCard` (arquivo existente de `/planos`), usando `isTrialAvailable` | FR-022 (decisão do André, CHK038): o selo só vale em Starter/Pro mensal no cartão; hoje aparece em qualquer periodicidade | Esconder o selo só na landing deixaria `/planos` e a landing diferentes e a regra duplicada |
