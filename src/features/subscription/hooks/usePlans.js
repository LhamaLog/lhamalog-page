import { fakePlans } from "../mocks/plans";
// Planos publicados na própria página. Não há chamada de rede.
const data = {
  moeda: "BRL",
  planoAtual: null,
  sessaoExpirada: false,
  planos: fakePlans().map((plan) => ({ ...plan, atual: false })),
};
export function usePlans() {
  return { data, error: "", loading: false, reload() {} };
}
