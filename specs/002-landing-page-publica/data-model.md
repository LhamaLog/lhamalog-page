# Data Model: Landing page pública do LhamaLog

A landing não grava nada. Os dados são conteúdo fixo em `src/features/landing/content.ts` e os planos que já existem. Não há API nova.

## Plano e Periodicidade (já existem)

- Tipos `Plan` e `BillingPeriod` em `src/features/subscription/types.ts`. A landing só lê.
- Fonte: `usePlans()` (Core ou dados falsos em desenvolvimento). Preço mostrado = `planPrice(plan, period, 'PIX')` dentro do `PublicPlanCard`; nada é calculado na landing.

## Seção da página

| Campo | Descrição |
|---|---|
| `id` | âncora: `como-funciona`, `recursos`, `planos`, `perguntas` |
| `label` | texto do link da barra: "Como funciona", "Recursos", "Planos", "Perguntas" |

Regra: cada `id` existe uma única vez na página e cada link da barra aponta para um `id` existente (testado).

## Card de "Como funciona"

`{ titulo: string, texto: string }` × 3, com os textos exatos da clarificação 2.

## Bloco de recurso

`{ id, titulo, texto, tela, invertido: boolean }` × 4 (ocorrências, sugestão por IA, dados sensíveis mascarados, alertas), textos exatos da clarificação 3. `invertido` alterna o lado da tela (1º normal, 2º invertido, 3º normal, 4º invertido).

## Pergunta frequente

`{ pergunta: string, resposta: string }` × 5 (como enviar logs, dados sensíveis, passar da franquia, cancelar, formas de pagamento). Texto aprovado na spec (FR-008), sem alteração.

## Destino do "Contratar"

Entrada: `plano` (código do plano, ex.: `PRO`), `periodo` (`SEMANAL` | `MENSAL` | `SEMESTRAL`), `contratarUrl` (variável de ambiente) e `origem` (endereço do site da página, lido de `window.location.origin` no componente; serve para conferir se o destino é do mesmo site).

Saída: caminho de cadastro com endereço de retorno, ou `null`.

| Situação | Resultado |
|---|---|
| `contratarUrl` vazio | `null` (mostrar "indisponível") |
| `contratarUrl` começa com `/` ou é do mesmo site que `origem` | `/sign-up?redirect_url=` + codificação de `<contratarUrl>?plano=<plano>&periodo=<periodo>` |
| `contratarUrl` de outro domínio, ou com esquema que não seja http/https | `null` |
| `periodo` fora da lista | `null` |

## Endereços legais

`LEGAL_LINKS: { termos: string | null, politica: string | null }`. `null` = desativado com "em breve".
