# Contrato: catálogo público de planos

O visitante e a seção de planos só leem este contrato. A gravação está em [ajuste-local.md](ajuste-local.md). Campos e regras: [data-model.md](../data-model.md).

## Leitura

- **Endereço**: `GET /planos.json`
- **Quem responde**: o próprio site, o arquivo `public/planos.json` copiado para a publicação. Não há outro serviço.
- **Corpo**: JSON do catálogo, codificação UTF-8.
- **Preços**: centavos inteiros. R$ 80,99 é `8099`.

A seção pede o arquivo ao abrir e de novo em "Tentar novamente", sem reaproveitar uma cópia antiga do navegador (`cache: "no-store"`).

## Resultado na seção

| Situação | O que a pessoa vê |
|---|---|
| Arquivo válido | os cinco cartões, seletor de periodicidade e o plano com `recomendado: true` em destaque |
| Arquivo ausente, ilegível ou reprovado na validação | "Falha ao carregar os planos", a descrição "Não foi possível ler o catálogo de planos." e "Tentar novamente" |
| Enquanto a leitura não voltou | "Carregando os planos..." |

Topo, "Como funciona", recursos, perguntas e chamada final não dependem dessa leitura.

Lista vazia não é um catálogo válido. Cai na falha, não no estado "não há planos".

## O que a página não aceita neste arquivo

A validação em `src/features/subscription/catalogo.js` recusa o documento, sem corrigi-lo sozinha, quando acontece qualquer caso do FR-006 da spec:

- moeda diferente de `BRL`
- quantidade de planos diferente de 5, ordem diferente, código repetido ou código fora dos cinco
- nome ou descrição vazios; selo só com espaço (selo ausente legítimo é `null`)
- nenhum `recomendado` ou mais de um
- franquia ou retenção menor ou igual a zero; chamadas de IA ausentes ou menores ou iguais a zero
- membros ou produtos iguais a zero (`null` continua ilimitado)
- Free com `precos`, GB a mais ou armazenamento extra preenchidos; Free com franquia fora de `"MES"`
- plano pago sem alguma periodicidade ou algum meio, com centavo menor ou igual a zero, ou com boleto diferente do Pix
- recurso de análise ou tipo de painel fora das listas do modelo
- campo que o modelo não lista

## "Contratar"

O código enviado continua o `codigo` do arquivo (`FREE`, `STARTER`, `PRO`, `BUSINESS`, `ENTERPRISE`) e a periodicidade escolhida no seletor. `contractUrl` não muda de regra.
