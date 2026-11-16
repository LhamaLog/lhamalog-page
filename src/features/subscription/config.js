// Dados falsos só existem em desenvolvimento: no build de produção a condição é falsa e o código falso sai do pacote.
export const fakeDataEnabled =
  import.meta.env.DEV && import.meta.env.VITE_USAR_DADOS_FALSOS === "true";
