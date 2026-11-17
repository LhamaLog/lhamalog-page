# Data model: catálogo de planos

Fonte única: `public/planos.json`. Forma e regras completas em [contracts/catalogo.md](contracts/catalogo.md). Os números iniciais são os de `src/features/subscription/mocks/plans.js` na data deste plano; a implementação move esses números para o JSON e apaga o módulo. Os textos iniciais estão em [research.md](research.md).

## Catálogo

| Campo | Regra |
|---|---|
| `moeda` | sempre `"BRL"` |
| `planos` | exatamente 5 itens, nesta ordem de `codigo`: `FREE`, `STARTER`, `PRO`, `BUSINESS`, `ENTERPRISE` |

Não há outros campos no catálogo. `atual` não entra no arquivo: a página pública marca todo plano como não atual ao exibir.

## Plano

| Campo | Regra |
|---|---|
| `codigo` | um dos cinco códigos, sem repetir e sem renomear |
| `nome` | texto não vazio |
| `descricao` | texto não vazio, a frase curta do cartão |
| `selo` | texto não vazio, ou `null` quando o cartão não tem etiqueta |
| `recomendado` | booleano; exatamente um plano do catálogo é `true` |
| `precos` | `null` no Free. Nos pagos, objeto com `SEMANAL`, `MENSAL` e `SEMESTRAL`; cada um tem `PIX`, `BOLETO`, `CARTAO` e `DEBITO` em centavos inteiros maiores que zero. `BOLETO` é igual a `PIX` |
| `franquiaGb` | número maior que zero |
| `franquiaPor` | `SEMANAL`, `MENSAL` e `SEMESTRAL`, cada um `"SEMANA"` ou `"MES"`. No Free os três são `"MES"` |
| `precoGbExcedenteCentavos` | `null` no Free. Nos pagos, os quatro meios, centavos inteiros maiores que zero, boleto igual ao Pix |
| `precoArmazenamentoExtraCentavos` | a mesma regra do GB a mais |
| `retencaoDias` | inteiro maior que zero |
| `dashboard` | `BASICO`, `PADRAO` ou `PERSONALIZADO` |
| `recursosAnalise` | lista, possivelmente vazia, sem repetir, só com `SUGESTOES_BASICAS`, `SUGESTOES_IA`, `DETECCAO_ANOMALIAS`, `INVESTIGACAO_AUTOMATICA`, `RASTREIO_USUARIO` |
| `chamadasIaMes` | inteiro maior que zero |
| `membrosIncluidos` | inteiro maior que zero, ou `null` (ilimitado) |
| `produtosIncluidos` | inteiro maior que zero, ou `null` (ilimitado) |

Campo desconhecido no catálogo ou no plano torna o documento inválido. Zero não significa ilimitado.

## Relação com o cartão

O cartão lê o plano e não guarda uma segunda lista de preços ou de textos.

- Preço mostrado: Pix da periodicidade escolhida. Free não tem preço.
- Desconto semestral: calculado por `semestralSavings` (seis mensalidades menos o semestral). Não é campo.
- Selo: `selo`. Recomendado: `recomendado`, um só.
- Membros ou produtos `null`: texto "ilimitado".
- Free: a nota do cartão continua "Ao chegar na franquia, a ingestão pausa." Pago: a nota usa o GB a mais do Pix.

## Estados do ajuste

1. **Vigente**: o JSON no disco passou na validação. A seção mostra esses planos.
2. **Rascunho**: o formulário local tem edições ainda não salvas. O arquivo e o site publicado não mudam.
3. **Recusado**: a validação falhou. O arquivo vigente permanece. O formulário lista o que corrigir.
4. **Publicado**: a equipe publica a página com o JSON vigente. Até lá, o site já no ar mostra o arquivo da publicação anterior.

Não há estado de plano incluído, removido ou reordenado. Essas tentativas caem em Recusado.
