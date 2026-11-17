# Contrato: contratação na própria página

A página pede o checkout ao processo que a serve. Não há outro serviço do LhamaLog neste caminho.

## Pedido

`POST /api/contratacao`

`Content-Type: application/json`

```json
{ "plano": "PRO", "periodo": "MENSAL" }
```

| Campo | Regra |
|---|---|
| `plano` | `STARTER`, `PRO`, `BUSINESS` ou `ENTERPRISE` |
| `periodo` | `SEMANAL`, `MENSAL` ou `SEMESTRAL` |

Qualquer outro campo no JSON é ignorado. Em especial, um valor, um nome ou um endereço enviados pelo navegador não entram no checkout. `GET` e os demais métodos não criam checkout.

## Resposta de sucesso

`200` e `Content-Type: application/json`:

```json
{ "url": "https://sandbox.asaas.com/checkoutSession/show?id=IDENTIFICADOR" }
```

O host é `sandbox.asaas.com` ou `asaas.com`, conforme [asaas-checkout.md](asaas-checkout.md). O caminho é `/checkoutSession/show` e o `id` não contém `/`, `?` nem `&`. A página só navega se a resposta obedecer a isso. Em produção configurada, o host é `asaas.com`.

## Resposta indisponível

`503` e o corpo `{ "disponivel": false }`.

Acontece quando a configuração falta ou a base não é uma das duas oficiais, quando o catálogo não valida, quando o plano ou a periodicidade não servem, quando o preço de cartão não é inteiro maior que zero, quando o Asaas não devolve um `id` utilizável, ou quando a chamada passa de 8 segundos. O corpo não inclui a chave, o pedido feito ao Asaas nem o erro cru.

A seção de planos, ao receber isso ou uma falha de rede, mostra a frase já existente: "A contratação não está disponível no momento. Tente novamente mais tarde." Não navega para app.lhamalog.com.

## O que a página não faz

- Não envia o plano Free para esta rota. "Começar grátis" continua em `signUpUrl`.
- Não mostra confirmação se a pessoa volta à origem, com ou sem query string.
- Não muda classe, texto ou ordem dos cartões.
