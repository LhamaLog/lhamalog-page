import { useCallback } from "react";
import { ApiError } from "../../../shared/services/api";
import { fakeDataEnabled } from "../config";
import { SubscriptionError } from "../errors";
import { useFakeApi } from "../mocks/fakeApi";
const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
// A landing é pública e não tem login: chama o Core sem token (a lista de planos é pública, LLT-230).
function useCoreApi() {
  const request = useCallback(async (path, options = {}) => {
    let response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...options.headers },
      });
    } catch (error) {
      if (options.signal?.aborted) throw error;
      throw new ApiError("Não foi possível conectar ao servidor. Tente novamente.", 0);
    }
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const fallback =
        response.status === 503
          ? "Falha ao carregar, tente novamente."
          : "Não foi possível concluir a operação. Tente novamente.";
      throw new SubscriptionError(
        body?.message ?? fallback,
        response.status,
        body?.fieldErrors ?? {},
        body?.code,
      );
    }
    if (body === null)
      throw new ApiError("O servidor retornou uma resposta inválida.", response.status);
    return body;
  }, []);
  return { request, ready: true };
}
export const useSubscriptionApi = fakeDataEnabled ? useFakeApi : useCoreApi;
