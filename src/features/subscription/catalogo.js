// Validação do catálogo de planos. Sem React e sem ler arquivo: o teste e o
// servidor de desenvolvimento importam o mesmo módulo.
const CODIGOS = ["FREE", "STARTER", "PRO", "BUSINESS", "ENTERPRISE"];
const PERIODOS = ["SEMANAL", "MENSAL", "SEMESTRAL"];
const MEIOS = ["PIX", "BOLETO", "CARTAO", "DEBITO"];
const PAINEIS = ["BASICO", "PADRAO", "PERSONALIZADO"];
const RECURSOS = [
  "SUGESTOES_BASICAS",
  "SUGESTOES_IA",
  "DETECCAO_ANOMALIAS",
  "INVESTIGACAO_AUTOMATICA",
  "RASTREIO_USUARIO",
];
const CHAVES_CATALOGO = ["moeda", "planos"];
const CHAVES_PLANO = [
  "codigo",
  "nome",
  "descricao",
  "selo",
  "recomendado",
  "precos",
  "franquiaGb",
  "franquiaPor",
  "precoGbExcedenteCentavos",
  "precoArmazenamentoExtraCentavos",
  "retencaoDias",
  "dashboard",
  "recursosAnalise",
  "chamadasIaMes",
  "membrosIncluidos",
  "produtosIncluidos",
];

function objeto(valor) {
  return valor !== null && typeof valor === "object" && !Array.isArray(valor);
}

function textoPreenchido(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

function inteiroPositivo(valor) {
  return Number.isInteger(valor) && valor > 0;
}

function chavesIguais(valor, esperadas) {
  if (!objeto(valor)) return false;
  const chaves = Object.keys(valor);
  return chaves.length === esperadas.length && esperadas.every((chave) => chaves.includes(chave));
}

function meios(valor, erros, onde) {
  if (!chavesIguais(valor, MEIOS)) {
    erros.push(`${onde} precisa ter PIX, BOLETO, CARTAO e DEBITO.`);
    return;
  }
  for (const meio of MEIOS) {
    if (!inteiroPositivo(valor[meio])) erros.push(`${onde} em ${meio} precisa ser centavos inteiros maiores que zero.`);
  }
  if (valor.BOLETO !== valor.PIX) erros.push(`${onde}: o boleto precisa ser igual ao Pix.`);
}

function blocoPago(valor, erros, onde) {
  if (!chavesIguais(valor, PERIODOS)) {
    erros.push(`${onde} precisa ter SEMANAL, MENSAL e SEMESTRAL.`);
    return;
  }
  for (const periodo of PERIODOS) meios(valor[periodo], erros, `${onde} ${periodo}`);
}

function limites(valor, erros, onde) {
  if (valor === null) return;
  if (!inteiroPositivo(valor)) erros.push(`${onde} precisa ser inteiro maior que zero, ou null para ilimitado.`);
}

export function reaisParaCentavos(texto) {
  const bruto = String(texto ?? "").trim();
  if (!bruto || bruto.startsWith("-") || !/^\d+(?:[.,]\d{1,2})?$/.test(bruto)) {
    return { ok: false, erros: ["Use um valor em reais maior que zero, com no máximo duas casas."] };
  }
  const [reais, fracao = ""] = bruto.split(/[.,]/);
  const centavos = Number(reais) * 100 + Number((fracao + "00").slice(0, 2));
  if (!Number.isSafeInteger(centavos) || centavos <= 0) {
    return { ok: false, erros: ["Use um valor em reais maior que zero, com no máximo duas casas."] };
  }
  return { ok: true, centavos };
}

export function ordenarCatalogo(catalogo) {
  const planos = catalogo.planos.map((plano) => {
    const ordenado = {};
    for (const chave of CHAVES_PLANO) ordenado[chave] = plano[chave];
    return ordenado;
  });
  return { moeda: catalogo.moeda, planos };
}

export function validateCatalog(catalogo) {
  const erros = [];
  if (!objeto(catalogo)) return { ok: false, erros: ["O catálogo precisa ser um objeto."] };
  for (const chave of Object.keys(catalogo)) {
    if (!CHAVES_CATALOGO.includes(chave)) erros.push(`Campo desconhecido no catálogo: ${chave}.`);
  }
  if (catalogo.moeda !== "BRL") erros.push('A moeda precisa ser "BRL".');
  if (!Array.isArray(catalogo.planos) || catalogo.planos.length !== CODIGOS.length) {
    erros.push("O catálogo precisa ter exatamente 5 planos, na ordem FREE, STARTER, PRO, BUSINESS e ENTERPRISE.");
    return { ok: false, erros };
  }

  catalogo.planos.forEach((plano, indice) => {
    const codigo = CODIGOS[indice];
    if (!objeto(plano)) {
      erros.push(`O plano ${codigo} precisa ser um objeto.`);
      return;
    }
    for (const chave of Object.keys(plano)) {
      if (!CHAVES_PLANO.includes(chave)) erros.push(`Campo desconhecido no plano ${codigo}: ${chave}.`);
    }
    if (plano.codigo !== codigo) erros.push(`O plano ${indice + 1} precisa ter o código ${codigo}.`);
    if (!textoPreenchido(plano.nome)) erros.push(`O plano ${codigo} precisa de nome.`);
    if (!textoPreenchido(plano.descricao)) erros.push(`O plano ${codigo} precisa de descrição.`);
    if (!(plano.selo === null || textoPreenchido(plano.selo))) {
      erros.push(`O selo do plano ${codigo} precisa ser texto ou null.`);
    }
    if (typeof plano.recomendado !== "boolean") erros.push(`O plano ${codigo} precisa dizer se é recomendado.`);
    const gratis = codigo === "FREE";
    if (gratis) {
      if (plano.precos !== null) erros.push("O plano FREE não tem preço.");
      if (plano.precoGbExcedenteCentavos !== null) erros.push("O plano FREE não tem valor por GB a mais.");
      if (plano.precoArmazenamentoExtraCentavos !== null) erros.push("O plano FREE não tem armazenamento extra.");
    } else {
      blocoPago(plano.precos, erros, `Preços de ${codigo}`);
      meios(plano.precoGbExcedenteCentavos, erros, `GB a mais de ${codigo}`);
      meios(plano.precoArmazenamentoExtraCentavos, erros, `Armazenamento extra de ${codigo}`);
    }
    if (typeof plano.franquiaGb !== "number" || !Number.isFinite(plano.franquiaGb) || plano.franquiaGb <= 0) {
      erros.push(`A franquia de ${codigo} precisa ser um número maior que zero.`);
    }
    if (!chavesIguais(plano.franquiaPor, PERIODOS)) {
      erros.push(`A franquia de ${codigo} precisa dizer SEMANAL, MENSAL e SEMESTRAL.`);
    } else {
      for (const periodo of PERIODOS) {
        const por = plano.franquiaPor[periodo];
        if (por !== "SEMANA" && por !== "MES") erros.push(`A franquia de ${codigo} em ${periodo} precisa ser SEMANA ou MES.`);
        if (gratis && por !== "MES") erros.push("A franquia do FREE é por mês nas três periodicidades.");
      }
    }
    if (!inteiroPositivo(plano.retencaoDias)) erros.push(`A retenção de ${codigo} precisa ser um inteiro maior que zero.`);
    if (!PAINEIS.includes(plano.dashboard)) erros.push(`O painel de ${codigo} precisa ser BASICO, PADRAO ou PERSONALIZADO.`);
    if (!Array.isArray(plano.recursosAnalise)) {
      erros.push(`Os recursos de ${codigo} precisam ser uma lista.`);
    } else {
      const vistos = new Set();
      for (const recurso of plano.recursosAnalise) {
        if (!RECURSOS.includes(recurso) || vistos.has(recurso)) {
          erros.push(`Recurso de análise inválido em ${codigo}.`);
        }
        vistos.add(recurso);
      }
    }
    if (!inteiroPositivo(plano.chamadasIaMes)) erros.push(`As chamadas de IA de ${codigo} precisam ser um inteiro maior que zero.`);
    limites(plano.membrosIncluidos, erros, `Membros de ${codigo}`);
    limites(plano.produtosIncluidos, erros, `Produtos de ${codigo}`);
  });

  const recomendados = catalogo.planos.filter((plano) => plano && plano.recomendado === true).length;
  if (recomendados !== 1) erros.push("Exatamente um plano precisa ser recomendado.");
  return { ok: erros.length === 0, erros };
}
