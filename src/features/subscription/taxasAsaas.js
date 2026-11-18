// Taxas padrão do Asaas, sem promoção. Fonte: aba "Taxas Asaas" da planilha
// "Plano de Monetização v4 - OpenObserve MGC". O preço do catálogo já inclui o
// gross-up; esta lista só informa a taxa e não recalcula o valor do plano.
export const TAXAS_ASAAS = [
  { meio: "Pix", valor: "R$ 1,99" },
  { meio: "Cartão de crédito", valor: "2,99% + R$ 0,49" },
  { meio: "Cartão de débito", valor: "1,89% + R$ 0,35" },
];

export const TAXAS_ASAAS_TITULO = "Taxas do Asaas";

export const TAXAS_ASAAS_NOTA =
  "Por cobrança recebida. O preço de cada plano é o do Pix e já inclui a taxa do Pix. No cartão, a cobrança usa a taxa correspondente.";
