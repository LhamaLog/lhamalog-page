// Endereços do sistema (lhamalog-web). A landing fica em outro site, então "Entrar", "Começar grátis" e "Contratar"
// levam ao app pelo endereço configurado em VITE_APP_URL (por exemplo, https://app.exemplo.com).
const APP_URL = String(import.meta.env?.VITE_APP_URL ?? "").replace(/\/+$/, "");
const PERIODS = ["SEMANAL", "MENSAL", "SEMESTRAL"];
export const signInUrl = (base = APP_URL) => `${base}/sign-in`;
export const signUpUrl = (base = APP_URL) => `${base}/sign-up`;
// "Contratar" (FR-010, FR-019): cadastro no app, com endereço de retorno para a contratação do plano escolhido.
// Só monta o endereço com o app configurado (http ou https); sem ele, devolve null e a página mostra "indisponível".
export function contractUrl(plan, period, base = APP_URL) {
  if (!/^https?:\/\/[^/\s]+$/.test(base)) return null;
  if (!PERIODS.includes(period) || !/^[A-Z_]+$/.test(plan)) return null;
  const destino = `${base}/assinatura/contratar?plano=${encodeURIComponent(plan)}&periodo=${encodeURIComponent(period)}`;
  return `${base}/sign-up?redirect_url=${encodeURIComponent(destino)}`;
}
