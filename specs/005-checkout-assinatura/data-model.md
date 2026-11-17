# Modelo: Checkout de assinatura ao contratar

Não há tabela nem arquivo novo de pagamento. O checkout vive só até o navegador ir à página do Asaas. Regras de preço do catálogo continuam em [catalogo.js](../../src/features/subscription/catalogo.js). Campos usados na contratação: [checkout.js](../../src/features/subscription/checkout.js), descrito em [contracts/asaas-checkout.md](contracts/asaas-checkout.md).

## Plano publicado

Já existe em `public/planos.json`. Esta entrega só lê.

| Campo | Uso |
|---|---|
| `codigo` | `STARTER`, `PRO`, `BUSINESS`, `ENTERPRISE` abrem checkout. `FREE` não. |
| `nome` | Entra no nome curto e na descrição, depois do corte de 30 caracteres no nome curto. |
| `precos[periodo].CARTAO` | Inteiro em centavos, maior que zero. É o único valor enviado ao Asaas. |
| `precos[periodo].PIX` | Continua sendo o preço desenhado no cartão. Não vai no checkout. |

`periodo` é o valor do seletor: `SEMANAL`, `MENSAL` ou `SEMESTRAL`.

Validação na rota, antes de chamar o Asaas: o catálogo passa em `validateCatalog`; o código é um dos quatro pagos; a periodicidade é uma das três; `CARTAO` é inteiro maior que zero. Qualquer outra coisa responde indisponível e não chama o Asaas.

## Configuração de acesso

Não é entidade gravada no repositório.

| Nome | Obrigatório | Valor |
|---|---|---|
| `ASAAS_BASE_URL` | sim, para abrir checkout | `https://api-sandbox.asaas.com/v3` até haver CNPJ e a equipe apontar produção para `https://api.asaas.com/v3` |
| `ASAAS_API_KEY` | sim, para abrir checkout | chave da conta do mesmo ambiente. No exemplo versionado, um texto que não é chave |

Ausente, vazio ou base fora dessas duas URLs: contratação indisponível.

## Checkout de assinatura

Não é persistido. Campos derivados no processo, não aceitos do navegador:

| Campo | Origem | Regra |
|---|---|---|
| Plano e periodicidade | corpo `{ plano, periodo }` | só códigos e periodicidades conhecidos |
| Valor em reais | `CARTAO / 100` | duas casas; nunca o Pix |
| Ciclo | mapa fixo | `SEMANAL` → `WEEKLY`, `MENSAL` → `MONTHLY`, `SEMESTRAL` → `SEMIANNUALLY` |
| Nome curto | nome do plano + periodicidade por extenso | no máximo 30 caracteres; a periodicidade permanece |
| Descrição | nome completo | `LhamaLog - Plano {nome} ({periodicidade})` |
| Referência | código e periodicidade | `{codigo}:{periodo}`, no máximo 200 caracteres |
| Primeira cobrança | relógio America/Sao_Paulo | agora, não uma data de teste |
| Retorno | origem do pedido | as três URLs são `scheme://host/` da própria landing |
| Identificador | resposta do Asaas | só serve para montar o endereço; não é gravado |
| Endereço | base configurada + id | host `sandbox.asaas.com` ou `asaas.com`, caminho `/checkoutSession/show` |

## Estados na página

Não há estado de assinatura.

| Estado | Quando | O que a pessoa vê |
|---|---|---|
| Pronto | seção de planos carregada | botão Contratar como hoje |
| Abrindo | o pedido à própria página ainda não voltou | o mesmo botão; outro clique nesse intervalo não cria outro checkout |
| Na página do Asaas | a resposta trouxe um endereço válido | o navegador sai da landing |
| Indisponível | configuração ausente, catálogo sem preço de cartão, Asaas recusou ou não respondeu a tempo | a frase que a página já usa; a pessoa pode clicar de novo |

Voltar do Asaas, por qualquer um dos três retornos, cai de novo em Pronto. A landing não tem estado "pago".
