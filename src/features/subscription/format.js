const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const number = new Intl.NumberFormat("pt-BR");
export function formatBRL(cents) {
  return currency.format(cents / 100);
}
export function formatNumber(value) {
  return number.format(value);
}
// null significa ilimitado (LLT-230, R16).
export function formatLimit(value) {
  return value === null ? "ilimitado" : formatNumber(value);
}
export const BILLING_PERIODS = [
  { value: "SEMANAL", label: "Semanal", suffix: "por semana" },
  { value: "MENSAL", label: "Mensal", suffix: "por mês" },
  { value: "SEMESTRAL", label: "Semestral", suffix: "por semestre" },
];
export const PAYMENT_METHODS = [
  { value: "PIX", label: "Pix" },
  { value: "CARTAO", label: "Cartão de crédito" },
  { value: "DEBITO", label: "Cartão de débito" },
  { value: "BOLETO", label: "Boleto" },
];
export function periodLabel(period) {
  return BILLING_PERIODS.find((item) => item.value === period)?.label ?? "";
}
export function periodSuffix(period) {
  return BILLING_PERIODS.find((item) => item.value === period)?.suffix ?? "";
}
// Só lê o preço que o Core mandou. Free (precos nulo) devolve null.
export function planPrice(plan, period, method) {
  return plan.precos?.[period]?.[method] ?? null;
}
const FEATURES = {
  SUGESTOES_BASICAS: "Sugestões básicas",
  SUGESTOES_IA: "Sugestões por IA",
  DETECCAO_ANOMALIAS: "Detecção de anomalias",
  INVESTIGACAO_AUTOMATICA: "Investigação automática",
  RASTREIO_USUARIO: "Rastreio de usuário",
};
export function featureLabel(code) {
  return FEATURES[code] ?? code.toLowerCase().replaceAll("_", " ");
}
const DASHBOARDS = { BASICO: "Básico", PADRAO: "Padrão", PERSONALIZADO: "Personalizado" };
export function dashboardLabel(type) {
  return DASHBOARDS[type];
}
export function quotaLabel(plan, period) {
  const per = plan.franquiaPor[period] === "SEMANA" ? "semana" : "mês";
  return `${formatNumber(plan.franquiaGb)} GB por ${per}`;
}
// "2026-11-08" para "08/11/2026", sem passar por fuso horário.
export function formatDate(iso) {
  const [year, month, day] = iso.slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : iso;
}
export function formatDateTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
// Lista do cartão do plano (Modelo A): o primeiro plano mostra tudo; os outros só o que muda em relação ao anterior.
export function planItems(plan, previous, period) {
  const items = [];
  const per = plan.franquiaPor[period] === "SEMANA" ? "semana" : "mês";
  items.push(`${formatNumber(plan.franquiaGb)} GB de logs por ${per}`);
  items.push(`Retenção de ${formatNumber(plan.retencaoDias)} dias`);
  const members =
    plan.membrosIncluidos === null
      ? "membros ilimitados"
      : `${formatNumber(plan.membrosIncluidos)} ${plan.membrosIncluidos === 1 ? "membro" : "membros"}`;
  const products =
    plan.produtosIncluidos === null
      ? "produtos ilimitados"
      : `${formatNumber(plan.produtosIncluidos)} ${plan.produtosIncluidos === 1 ? "produto" : "produtos"}`;
  items.push(`${members} e ${products}`);
  if (plan.chamadasIaMes !== null)
    items.push(`${formatNumber(plan.chamadasIaMes)} chamadas de IA por mês`);
  const alreadyHad = new Set(previous?.recursosAnalise ?? []);
  for (const feature of plan.recursosAnalise)
    if (!alreadyHad.has(feature)) items.push(featureLabel(feature));
  if (!previous || previous.dashboard !== plan.dashboard)
    items.push(`Dashboard ${dashboardLabel(plan.dashboard).toLowerCase()}`);
  return { title: previous ? `Tudo do ${previous.nome}, mais:` : "Inclui:", items };
}
