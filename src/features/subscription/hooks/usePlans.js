import { useCallback, useEffect, useState } from "react";
import { validateCatalog } from "../catalogo";

const ERRO = "Não foi possível ler o catálogo de planos.";

async function carregar() {
  const resposta = await fetch("/planos.json", { cache: "no-store" });
  if (!resposta.ok) throw new Error(ERRO);
  let corpo;
  try {
    corpo = await resposta.json();
  } catch {
    throw new Error(ERRO);
  }
  const resultado = validateCatalog(corpo);
  if (!resultado.ok) throw new Error(ERRO);
  return {
    moeda: corpo.moeda,
    planos: corpo.planos.map((plano) => ({ ...plano, atual: false })),
  };
}

// Oferta publicada em /planos.json. Sem arquivo válido, a seção mostra o erro e o resto da página segue.
export function usePlans() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const reload = useCallback(() => {
    let ativo = true;
    setLoading(true);
    setError("");
    carregar()
      .then((catalogo) => {
        if (!ativo) return;
        setData(catalogo);
        setLoading(false);
      })
      .catch(() => {
        if (!ativo) return;
        setData(null);
        setError(ERRO);
        setLoading(false);
      });
    return () => {
      ativo = false;
    };
  }, []);
  useEffect(() => reload(), [reload]);
  return { data, error, loading, reload };
}
