// DADOS FALSOS, só para desenvolvimento (VITE_USAR_DADOS_FALSOS=true). Responde a lista de planos no formato do contrato da LLT-230.
// Variações pela URL da página: ?simular=vazio | erro.
import { useCallback } from "react";
import { SubscriptionError } from "../errors";
import { fakePlans } from "./plans";
const DELAY_MS = 500;
const wait = (ms, signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
export async function fakeResponse(path, options = {}) {
  await wait(DELAY_MS, options.signal ?? undefined);
  const scenario = new URLSearchParams(window.location.search).get("simular");
  if (path === "/api/v1/planos") {
    if (scenario === "erro")
      throw new SubscriptionError("Falha ao carregar, tente novamente.", 503);
    const response = {
      moeda: "BRL",
      planoAtual: null,
      sessaoExpirada: false,
      planos: scenario === "vazio" ? [] : fakePlans().map((plan) => ({ ...plan, atual: false })),
    };
    return response;
  }
  throw new SubscriptionError("Rota falsa não encontrada.", 404);
}
export function useFakeApi() {
  const request = useCallback((path, options = {}) => fakeResponse(path, options), []);
  return { request, ready: true };
}
