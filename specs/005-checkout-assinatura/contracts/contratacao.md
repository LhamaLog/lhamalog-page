# Contrato: contratação na própria página

A página pede o checkout ao processo que a serve. Não há outro serviço do LhamaLog neste caminho.

## Pedido

`POST /api/contratacao`

`Content-Type: application/json`

```json
{ "plano": "PRO", "periodo": "MENSAL", "documento": "39053344705" }
```

| Campo | Regra |
|---|---|
| `plano` | `STARTER`, `PRO`, `BUSINESS` ou `ENTERPRISE` |
| `periodo` | `SEMANAL`, `MENSAL` ou `SEMESTRAL` |
| `documento` | CPF de 11 dígitos ou CNPJ de 14, com os verificadores corretos. Pontos, traço e barra são ignorados. |

Um valor, um nome ou um endereço enviados pelo navegador não entram no checkout. `GET` e os demais métodos não criam checkout.

## Resposta de sucesso

`200` e `Content-Type: application/json`:

```json
{ "url": "https://sandbox.asaas.com/checkoutSession/show?id=IDENTIFICADOR" }
```

O host é `sandbox.asaas.com` ou `asaas.com`, conforme [asaas-checkout.md](asaas-checkout.md). O caminho é `/checkoutSession/show` e o `id` não contém `/`, `?` nem `&`. A página só navega se a resposta obedecer a isso. Em produção configurada, o host é `asaas.com`.

## Documento inválido

`400` e o corpo `{ "documentoInvalido": true }`.

A seção mostra "Informe um CPF ou CNPJ válido." O Asaas não é consultado.

## Assinatura já ativa

`409` e o corpo `{ "assinaturaAtiva": true }`.

Antes do checkout, a rota busca `GET /customers?cpfCnpj=` e, se achar o cliente, `GET /subscriptions?customer=`. Havendo alguma assinatura com status `ACTIVE`, o checkout não é criado. A seção mostra "Este CPF ou CNPJ já tem uma assinatura ativa."

Se o cliente existe e nenhuma assinatura está `ACTIVE`, o `POST /checkouts` inclui `customer` com o id dele. Se o documento ainda não é cliente, o checkout segue sem `customer`.

## Resposta indisponível

`503` e o corpo `{ "disponivel": false }`.

Acontece quando a configuração falta ou a base não é uma das duas oficiais, quando o catálogo não valida, quando o plano ou a periodicidade não servem, quando o preço de cartão não é inteiro maior que zero, quando o Asaas não devolve um `id` utilizável, ou quando a chamada passa de 8 segundos. O corpo não inclui a chave, o pedido feito ao Asaas nem o erro cru.

A seção de planos, ao receber isso ou uma falha de rede, mostra a frase já existente: "A contratação não está disponível no momento. Tente novamente mais tarde." Não navega para app.lhamalog.com.

## O que a página não faz

- Não envia o plano Free para esta rota. "Começar grátis" continua em `signUpUrl`.
- Não mostra confirmação se a pessoa volta à origem, com ou sem query string.
- Não muda classe, texto ou ordem dos cartões.
