function prices(pix, card, debit) {
  const byMethod = (index) => ({
    PIX: pix[index],
    BOLETO: pix[index],
    CARTAO: card[index],
    DEBITO: debit[index],
  });
  return { SEMANAL: byMethod(0), MENSAL: byMethod(1), SEMESTRAL: byMethod(2) };
}
const byMethod = (pix, card, debit) => ({
  PIX: pix,
  BOLETO: pix,
  CARTAO: card,
  DEBITO: debit,
});
// Função (e não constante) para o bundler descartar tudo isto no build de produção.
export function fakePlans() {
  const quotaPer = { SEMANAL: "SEMANA", MENSAL: "MES", SEMESTRAL: "MES" };
  // Free não tem periodicidade: a franquia de 1 GB é sempre por mês.
  const freeQuotaPer = { SEMANAL: "MES", MENSAL: "MES", SEMESTRAL: "MES" };
  const extraStorage = byMethod(10, 11, 11);
  return [
    {
      codigo: "FREE",
      nome: "Free",
      precos: null,
      franquiaGb: 1,
      franquiaPor: freeQuotaPer,
      precoGbExcedenteCentavos: null,
      precoArmazenamentoExtraCentavos: null,
      retencaoDias: 7,
      dashboard: "BASICO",
      recursosAnalise: ["SUGESTOES_BASICAS"],
      chamadasIaMes: 10,
      membrosIncluidos: 1,
      produtosIncluidos: 1,
      testeGratisDias: null,
    },
    {
      codigo: "STARTER",
      nome: "Starter",
      precos: prices([2023, 8099, 47599], [1930, 8195, 48912], [1894, 8088, 48349]),
      franquiaGb: 10,
      franquiaPor: quotaPer,
      precoGbExcedenteCentavos: byMethod(600, 619, 612),
      precoArmazenamentoExtraCentavos: extraStorage,
      retencaoDias: 15,
      dashboard: "PADRAO",
      recursosAnalise: ["SUGESTOES_IA"],
      chamadasIaMes: 100,
      membrosIncluidos: 3,
      produtosIncluidos: 3,
      testeGratisDias: 14,
    },
    {
      codigo: "PRO",
      nome: "Pro",
      precos: prices([9407, 40099, 239599], [9542, 41181, 246830], [9421, 40705, 244048]),
      franquiaGb: 100,
      franquiaPor: quotaPer,
      precoGbExcedenteCentavos: byMethod(450, 464, 459),
      precoArmazenamentoExtraCentavos: extraStorage,
      retencaoDias: 30,
      dashboard: "PADRAO",
      recursosAnalise: ["DETECCAO_ANOMALIAS", "SUGESTOES_IA"],
      chamadasIaMes: 1000,
      membrosIncluidos: 10,
      produtosIncluidos: 10,
      testeGratisDias: 14,
    },
    {
      codigo: "BUSINESS",
      nome: "Business",
      precos: prices([34584, 149199, 894199], [35495, 153643, 921605], [35083, 151907, 911258]),
      franquiaGb: 500,
      franquiaPor: quotaPer,
      precoGbExcedenteCentavos: byMethod(350, 361, 357),
      precoArmazenamentoExtraCentavos: extraStorage,
      retencaoDias: 90,
      dashboard: "PADRAO",
      recursosAnalise: ["INVESTIGACAO_AUTOMATICA", "DETECCAO_ANOMALIAS"],
      chamadasIaMes: 5000,
      membrosIncluidos: 25,
      produtosIncluidos: null,
      testeGratisDias: null,
    },
    {
      codigo: "ENTERPRISE",
      nome: "Enterprise",
      precos: prices([62276, 269199, 1614199], [64041, 277342, 1663797], [63309, 274218, 1645128]),
      franquiaGb: 1000,
      franquiaPor: quotaPer,
      precoGbExcedenteCentavos: byMethod(280, 289, 286),
      precoArmazenamentoExtraCentavos: extraStorage,
      retencaoDias: 90,
      dashboard: "PERSONALIZADO",
      recursosAnalise: ["INVESTIGACAO_AUTOMATICA", "RASTREIO_USUARIO"],
      chamadasIaMes: 15000,
      membrosIncluidos: null,
      produtosIncluidos: null,
      testeGratisDias: null,
    },
  ];
}
