# Contrato: checkout de assinatura no Asaas

Quem chama é o processo da página, por Axios. O navegador não faz este pedido e não vê a chave.

## Pedido

`POST {ASAAS_BASE_URL}/checkouts`

A base já inclui `/v3`, então o caminho completo é `/v3/checkouts`.

Cabeçalhos:

| Nome | Valor |
|---|---|
| `access_token` | `ASAAS_API_KEY` |
| `User-Agent` | `LhamaLog-Page` |
| `Content-Type` | `application/json` |

Corpo, para o Pro mensal a R$ 81,95 (8195 centavos no catálogo):

```json
{
  "billingTypes": ["CREDIT_CARD"],
  "chargeTypes": ["RECURRENT"],
  "minutesToExpire": 60,
  "externalReference": "PRO:MENSAL",
  "callback": {
    "successUrl": "https://lhamalog.com/",
    "cancelUrl": "https://lhamalog.com/",
    "expiredUrl": "https://lhamalog.com/"
  },
  "items": [
    {
      "name": "Plano Pro (mensal)",
      "description": "LhamaLog - Plano Pro (mensal)",
      "quantity": 1,
      "value": 81.95
    }
  ],
  "subscription": {
    "cycle": "MONTHLY",
    "nextDueDate": "2026-11-17 12:13:00"
  }
}
```

As três URLs de `callback` são a origem real do pedido, não um endereço fixo. `nextDueDate` é o instante atual em America/Sao_Paulo. Não se envia `customerData`, `installment` nem `endDate`. `customer` só entra quando o documento já é um cliente sem assinatura `ACTIVE`.

| Periodicidade da página | `cycle` | Sufixo do nome |
|---|---|---|
| `SEMANAL` | `WEEKLY` | `(semanal)` |
| `MENSAL` | `MONTHLY` | `(mensal)` |
| `SEMESTRAL` | `SEMIANNUALLY` | `(semestral)` |

`items[0].name` tem no máximo 30 caracteres. Se `Plano {nome} {sufixo}` passar disso, o nome do plano é encurtado e o prefixo `Plano ` e o sufixo permanecem. `value` é o preço `CARTAO` em reais, com duas casas. `externalReference` é `{codigo}:{periodo}`.

## Resposta usada

`200` com JSON que tenha `id` string, sem `/`, `?` ou `&`. Desse `id` sai o endereço:

| `ASAAS_BASE_URL` | Endereço devolvido à página |
|---|---|
| `https://api-sandbox.asaas.com/v3` | `https://sandbox.asaas.com/checkoutSession/show?id={id}` |
| `https://api.asaas.com/v3` | `https://asaas.com/checkoutSession/show?id={id}` |

Outra base, outro status ou `id` ausente: a página recebe indisponível. O `id` não é gravado. Esta entrega não configura webhook.

## Ambiente

O exemplo versionado aponta a base de testes e uma chave falsa. Produção só quando a equipe trocar a base, depois do CNPJ, como o guia da conta Asaas descreve. Uma chave de um ambiente não serve no outro.
