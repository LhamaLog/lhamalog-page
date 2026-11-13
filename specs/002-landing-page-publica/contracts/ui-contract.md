# Contrato de interface: landing em `/`

O projeto não expõe API nova. Este contrato descreve o que a página promete a quem a usa e às outras telas.

## Rota

| Rota | Quem | Resultado |
|---|---|---|
| `/` | visitante (sem sessão ativa) | landing |
| `/` | pessoa com sessão ativa | redireciona para `/empresa` (sem exibir a landing) |
| `/` | enquanto a sessão carrega | indicador de carregamento (nem landing nem área interna, nunca tela em branco) |
| `/` | verificação de sessão lenta ou com falha (passou do tempo limite) | landing para o visitante (FR-021) |
| `/planos` | todos | continua igual (página de planos própria) |

## Âncoras

`#como-funciona`, `#recursos`, `#planos`, `#perguntas`. Cada título de seção fica visível ao chegar (margem de rolagem maior que a barra).

## Ações e destinos

| Ação | Destino |
|---|---|
| "Entrar" | `/sign-in` |
| "Começar grátis" (barra, topo, chamada final) | `/sign-up` |
| Free → "Começar grátis" (card) | `/sign-up` (já é assim no card) |
| "Ver planos" | `#planos` |
| "Contratar" (card pago) | `/sign-up?redirect_url=<contratarUrl>?plano=<codigo>&periodo=<periodo>` (ver data-model); quem já tem conta entra pelo link da própria tela de cadastro; destino não configurado ou de outro site → mensagem "indisponível" (FR-019) |
| Termos de Uso / Política de Privacidade | desativados, "em breve", até `LEGAL_LINKS` ser preenchido |

## Configuração de ambiente

| Variável | Uso | Padrão |
|---|---|---|
| `VITE_CONTRATAR_URL` | endereço do fluxo de contratar (outro projeto): caminho como `/assinatura/contratar` ou endereço do mesmo domínio | vazio (a landing mostra "indisponível" no "Contratar") |

Entra em `.env.example` com comentário; o valor real é do André/da equipe.

## Contrato com `/planos` (refatoração)

`PlansCatalog` recebe: `state` (o retorno de `usePlans()`: `data`, `error`, `loading`, `reload`; cada página chama o hook uma vez), `onSubscribe(plan, period)`, `initialPeriod?` (padrão mensal), `header?` (entra antes do seletor) e `notice?` (entra entre o seletor e os estados). `PublicPlansPage` continua exibindo o mesmo cabeçalho, aviso de sessão expirada e grade, e continua navegando para `/assinatura/contratar?plano=…&periodo=…`. Verificação: comparar `/planos` antes e depois (quickstart, cenário 7).

## Garantias de qualidade (testáveis)

- Sem rolagem lateral em 1672, 1440, 1024, 375 px.
- Toda ação e sanfona por teclado; foco visível.
- Contraste ≥ 4,5:1.
- Animações só com `motion-safe`.
- Nenhuma imagem de terceiros; nenhum número de clientes, logo de cliente, depoimento ou resultado.

## Selo do teste e legenda das telas

- O selo "Teste grátis de 14 dias" do `PublicPlanCard` aparece só quando `isTrialAvailable(plan, period, 'CARTAO')` é verdadeiro; vale para `/planos` e para a landing (FR-022).
- Cada tela de exemplo traz a legenda visível "Exemplo ilustrativo" (FR-020).
