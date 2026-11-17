// Endereços do sistema (lhamalog-web). A landing fica em outro site, então "Acessar Página" e
// "Começar grátis" levam ao app. Contratar abre o checkout do Asaas, em outro módulo.
// O endereço padrão é https://app.lhamalog.com; em desenvolvimento dá para trocar por VITE_APP_URL.
export const DEFAULT_APP_URL = "https://app.lhamalog.com";
const APP_URL = String(import.meta.env?.VITE_APP_URL || DEFAULT_APP_URL).replace(/\/+$/, "");
export const signInUrl = (base = APP_URL) => `${base}/sign-in`;
export const signUpUrl = (base = APP_URL) => `${base}/sign-up`;
