// Pedido do checkout de assinatura e endereço da página do Asaas.
// Sem React, sem Axios, sem arquivo e sem variável de ambiente: o teste e o plugin usam o mesmo módulo.
const PAGOS = ["STARTER", "PRO", "BUSINESS", "ENTERPRISE"];
const PERIODOS = ["SEMANAL", "MENSAL", "SEMESTRAL"];
const CICLOS = { SEMANAL: "WEEKLY", MENSAL: "MONTHLY", SEMESTRAL: "SEMIANNUALLY" };
const SUFIXOS = { SEMANAL: "semanal", MENSAL: "mensal", SEMESTRAL: "semestral" };
const BASES = {
  "https://api-sandbox.asaas.com/v3": "https://sandbox.asaas.com",
  "https://api.asaas.com/v3": "https://asaas.com",
};

const indisponivel = () => ({ disponivel: false });

// Lê KEY=valor sem expandir $. A chave do Asaas começa com $aact_, e o leitor
// comum do Vite apagaria esse trecho achando que é outra variável.
export function lerEnvLiteral(texto) {
  const vars = {};
  for (const linha of String(texto ?? "").split("\n")) {
    const limpa = linha.trim();
    if (!limpa || limpa.startsWith("#") || !limpa.includes("=")) continue;
    const corte = limpa.indexOf("=");
    const nome = limpa.slice(0, corte).trim();
    let valor = limpa.slice(corte + 1).trim();
    if ((valor.startsWith('"') && valor.endsWith('"')) || (valor.startsWith("'") && valor.endsWith("'"))) {
      valor = valor.slice(1, -1);
    }
    valor = valor.replace(/\\\$/g, "$");
    if (nome) vars[nome] = valor;
  }
  return vars;
}

function texto(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

function retorno(origem) {
  let url;
  try {
    url = new URL(origem);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  // O Asaas recusa successUrl/cancelUrl/expiredUrl com o nome "localhost" (400).
  // 127.0.0.1 é o mesmo servidor e o sandbox aceita.
  if (url.hostname === "localhost") url.hostname = "127.0.0.1";
  return `${url.origin}/`;
}

function dataHoraSaoPaulo(agora) {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(agora);
  const ler = (tipo) => partes.find((parte) => parte.type === tipo)?.value;
  const ano = ler("year");
  const mes = ler("month");
  const dia = ler("day");
  const hora = ler("hour");
  const minuto = ler("minute");
  const segundo = ler("second");
  if (!ano || !mes || !dia || !hora || !minuto || !segundo) return null;
  return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
}

function nomeCurto(nome, sufixo) {
  const prefixo = "Plano ";
  const cauda = ` (${sufixo})`;
  const inteiro = `${prefixo}${nome}${cauda}`;
  if (inteiro.length <= 30) return inteiro;
  const limite = 30 - prefixo.length - cauda.length;
  return `${prefixo}${nome.slice(0, Math.max(0, limite))}${cauda}`;
}

export function montarPedido({ codigo, nome, periodo, centavosCartao, origem, agora }) {
  if (!PAGOS.includes(codigo) || !PERIODOS.includes(periodo)) return indisponivel();
  if (!texto(nome)) return indisponivel();
  if (!Number.isInteger(centavosCartao) || centavosCartao <= 0) return indisponivel();
  const volta = retorno(origem);
  const quando = agora instanceof Date && !Number.isNaN(agora.getTime()) ? dataHoraSaoPaulo(agora) : null;
  if (!volta || !quando) return indisponivel();
  const sufixo = SUFIXOS[periodo];
  const referencia = `${codigo}:${periodo}`;
  if (referencia.length > 200) return indisponivel();
  return {
    disponivel: true,
    pedido: {
      billingTypes: ["CREDIT_CARD"],
      chargeTypes: ["RECURRENT"],
      minutesToExpire: 60,
      externalReference: referencia,
      callback: { successUrl: volta, cancelUrl: volta, expiredUrl: volta },
      items: [
        {
          name: nomeCurto(nome.trim(), sufixo),
          description: `LhamaLog - Plano ${nome.trim()} (${sufixo})`,
          quantity: 1,
          value: Number((centavosCartao / 100).toFixed(2)),
        },
      ],
      subscription: {
        cycle: CICLOS[periodo],
        nextDueDate: quando,
      },
    },
  };
}

export function urlDoCheckout(baseUrl, id) {
  const host = BASES[baseUrl];
  if (!host || typeof id !== "string" || !/^[A-Za-z0-9_-]+$/.test(id)) return indisponivel();
  return { disponivel: true, url: `${host}/checkoutSession/show?id=${id}` };
}
