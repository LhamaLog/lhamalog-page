// O teste de 14 dias só vale em Starter ou Pro, mensal, no cartão (LLT-231); quem informa o plano é o Core (testeGratisDias).
export function isTrialAvailable(plan, period, method) {
  return plan.testeGratisDias === 14 && period === "MENSAL" && method === "CARTAO";
}
