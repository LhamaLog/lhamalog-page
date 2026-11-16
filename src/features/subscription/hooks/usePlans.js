import { useEffect, useState } from "react";
import { useSubscriptionApi } from "./useSubscriptionApi";
export function usePlans() {
  const { request, ready } = useSubscriptionApi();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    request("/api/v1/planos", { signal: controller.signal })
      .then((value) => {
        if (!controller.signal.aborted) setData(value);
      })
      .catch((reason) => {
        if (!controller.signal.aborted) setError(reason.message ?? "Falha ao carregar os planos.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [request, ready, revision]);
  return { data, error, loading, reload: () => setRevision((value) => value + 1) };
}
