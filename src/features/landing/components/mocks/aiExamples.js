// Exemplos fictícios da IA (hipótese de causa e sugestão de correção). Dois exemplos diferentes (outro serviço e outro erro), para a
// página não se repetir: "pedidos" na janela dos logs do topo (LogStreamMock) e "faturas" no bloco 2 de recursos (AiSuggestionMock).
// As duas telas levam o mesmo aria-label e a mesma legenda aprovados (FR-020).
export const AI_EXAMPLES = {
  // Topo (janela dos logs, LogStreamMock)
  pedidos: {
    erro: "Valor vazio ao criar o pedido",
    causa: "O campo do cliente chega vazio quando o pedido é criado sem cadastro.",
    correcao: "Conferir o campo antes de usar e devolver uma mensagem de erro clara.",
  },
  // Bloco "Sugestão de causa com IA"
  faturas: {
    erro: "Falha de conexão com o banco ao gerar a fatura",
    causa: "As conexões com o banco acabam nos horários de maior uso do serviço de faturas.",
    correcao:
      "Reaproveitar as conexões abertas e tentar de novo com uma pequena espera antes de falhar.",
  },
};
