import { useEffect, useState } from "react";
import { ordenarCatalogo, reaisParaCentavos, validateCatalog } from "../../catalogo";

const PERIODOS = [
  ["SEMANAL", "Semanal"],
  ["MENSAL", "Mensal"],
  ["SEMESTRAL", "Semestral"],
];
const MEIOS = [
  ["PIX", "Pix"],
  ["CARTAO", "Cartão de crédito"],
  ["DEBITO", "Cartão de débito"],
];
const PAINEIS = [
  ["BASICO", "Básico"],
  ["PADRAO", "Padrão"],
  ["PERSONALIZADO", "Personalizado"],
];
const RECURSOS = [
  ["SUGESTOES_BASICAS", "Sugestões básicas"],
  ["SUGESTOES_IA", "Sugestões por IA"],
  ["DETECCAO_ANOMALIAS", "Detecção de anomalias"],
  ["INVESTIGACAO_AUTOMATICA", "Investigação automática"],
  ["RASTREIO_USUARIO", "Rastreio de usuário"],
];

function reais(centavos) {
  if (centavos == null) return "";
  return `${Math.trunc(centavos / 100)},${String(centavos % 100).padStart(2, "0")}`;
}
function rascunho(planos) {
  return planos.map((plano) => ({
    codigo: plano.codigo,
    nome: plano.nome,
    descricao: plano.descricao,
    selo: plano.selo ?? "",
    recomendado: plano.recomendado === true,
    franquiaGb: String(plano.franquiaGb),
    franquiaPor: { ...plano.franquiaPor },
    retencaoDias: String(plano.retencaoDias),
    chamadasIaMes: String(plano.chamadasIaMes),
    membrosIlimitado: plano.membrosIncluidos === null,
    membros: plano.membrosIncluidos == null ? "" : String(plano.membrosIncluidos),
    produtosIlimitado: plano.produtosIncluidos === null,
    produtos: plano.produtosIncluidos == null ? "" : String(plano.produtosIncluidos),
    dashboard: plano.dashboard,
    recursosAnalise: [...plano.recursosAnalise],
    precos: plano.precos
      ? Object.fromEntries(PERIODOS.map(([periodo]) => [periodo, {
          PIX: reais(plano.precos[periodo].PIX),
          CARTAO: reais(plano.precos[periodo].CARTAO),
          DEBITO: reais(plano.precos[periodo].DEBITO),
        }]))
      : null,
    gb: plano.precoGbExcedenteCentavos
      ? { PIX: reais(plano.precoGbExcedenteCentavos.PIX), CARTAO: reais(plano.precoGbExcedenteCentavos.CARTAO), DEBITO: reais(plano.precoGbExcedenteCentavos.DEBITO) }
      : null,
    extra: plano.precoArmazenamentoExtraCentavos
      ? { PIX: reais(plano.precoArmazenamentoExtraCentavos.PIX), CARTAO: reais(plano.precoArmazenamentoExtraCentavos.CARTAO), DEBITO: reais(plano.precoArmazenamentoExtraCentavos.DEBITO) }
      : null,
  }));
}
function meiosDe(campos, erros, onde) {
  const pix = reaisParaCentavos(campos.PIX);
  const cartao = reaisParaCentavos(campos.CARTAO);
  const debito = reaisParaCentavos(campos.DEBITO);
  if (!pix.ok) erros.push(`${onde} no Pix: ${pix.erros[0]}`);
  if (!cartao.ok) erros.push(`${onde} no cartão de crédito: ${cartao.erros[0]}`);
  if (!debito.ok) erros.push(`${onde} no cartão de débito: ${debito.erros[0]}`);
  return { PIX: pix.centavos, BOLETO: pix.centavos, CARTAO: cartao.centavos, DEBITO: debito.centavos };
}
function montar(planos) {
  const erros = [];
  const corpo = planos.map((plano) => {
    const gratis = plano.codigo === "FREE";
    const franquia = Number(String(plano.franquiaGb).trim().replace(",", "."));
    const retencao = Number(plano.retencaoDias);
    const chamadas = Number(plano.chamadasIaMes);
    const membros = plano.membrosIlimitado ? null : Number(plano.membros);
    const produtos = plano.produtosIlimitado ? null : Number(plano.produtos);
    if (!Number.isFinite(franquia)) erros.push(`A franquia de ${plano.codigo} precisa ser um número maior que zero.`);
    return {
      codigo: plano.codigo,
      nome: plano.nome,
      descricao: plano.descricao,
      selo: plano.selo.trim() ? plano.selo.trim() : null,
      recomendado: plano.recomendado,
      precos: gratis ? null : Object.fromEntries(PERIODOS.map(([periodo]) => [periodo, meiosDe(plano.precos[periodo], erros, `Preço ${periodo.toLowerCase()} de ${plano.codigo}`)])),
      franquiaGb: franquia,
      franquiaPor: gratis ? { SEMANAL: "MES", MENSAL: "MES", SEMESTRAL: "MES" } : { ...plano.franquiaPor },
      precoGbExcedenteCentavos: gratis ? null : meiosDe(plano.gb, erros, `GB a mais de ${plano.codigo}`),
      precoArmazenamentoExtraCentavos: gratis ? null : meiosDe(plano.extra, erros, `Armazenamento extra de ${plano.codigo}`),
      retencaoDias: retencao,
      dashboard: plano.dashboard,
      recursosAnalise: plano.recursosAnalise,
      chamadasIaMes: chamadas,
      membrosIncluidos: membros,
      produtosIncluidos: produtos,
    };
  });
  if (erros.length > 0) return { ok: false, erros };
  const catalogo = ordenarCatalogo({ moeda: "BRL", planos: corpo });
  const resultado = validateCatalog(catalogo);
  if (!resultado.ok) return resultado;
  return { ok: true, catalogo };
}

export function AjustePlanos({ catalogo, onSaved }) {
  const [planos, setPlanos] = useState(() => rascunho(catalogo.planos));
  const [erros, setErros] = useState([]);
  const [salvando, setSalvando] = useState(false);
  useEffect(() => {
    setPlanos(rascunho(catalogo.planos));
  }, [catalogo]);
  const alterar = (indice, patch) => {
    setPlanos((atual) => atual.map((plano, i) => (i === indice ? { ...plano, ...patch } : plano)));
  };
  const salvar = async (evento) => {
    evento.preventDefault();
    const montado = montar(planos);
    if (!montado.ok) {
      setErros(montado.erros);
      return;
    }
    setSalvando(true);
    try {
      const resposta = await fetch("/__dev/planos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(montado.catalogo),
      });
      const payload = await resposta.json().catch(() => null);
      if (resposta.status === 400) {
        setErros(payload?.erros?.length ? payload.erros : ["Não foi possível salvar."]);
        return;
      }
      if (!resposta.ok || !payload?.ok) {
        setErros(["Não foi possível salvar."]);
        return;
      }
      setErros([]);
      onSaved();
    } catch {
      setErros(["Não foi possível salvar."]);
    } finally {
      setSalvando(false);
    }
  };
  return (
    <form onSubmit={salvar} className="space-y-6 rounded-2xl border border-[#D2E1F6] bg-white p-5 text-left">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-[#033473]">Ajustar a oferta</h3>
        <p className="text-sm text-slate-600">
          Este formulário só existe nesta execução local. O site já publicado continua com a oferta anterior até a próxima publicação.
        </p>
      </div>
      {erros.length > 0 && (
        <ul className="list-disc space-y-1 rounded-xl bg-red-50 px-5 py-3 text-sm text-red-800" role="alert">
          {erros.map((erro) => <li key={erro}>{erro}</li>)}
        </ul>
      )}
      {planos.map((plano, indice) => (
        <fieldset key={plano.codigo} className="space-y-3 rounded-xl border border-slate-200 p-4">
          <legend className="px-1 text-base font-bold text-[#033473]">{plano.codigo}</legend>
          <label className="block text-sm font-semibold text-[#033473]">
            Nome
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" value={plano.nome} onChange={(evento) => alterar(indice, { nome: evento.target.value })} />
          </label>
          <label className="block text-sm font-semibold text-[#033473]">
            Descrição
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" value={plano.descricao} onChange={(evento) => alterar(indice, { descricao: evento.target.value })} />
          </label>
          <label className="block text-sm font-semibold text-[#033473]">
            Selo
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" value={plano.selo} onChange={(evento) => alterar(indice, { selo: evento.target.value })} />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#033473]">
            <input
              type="radio"
              name="recomendado"
              checked={plano.recomendado}
              onChange={() => setPlanos((atual) => atual.map((item, i) => ({ ...item, recomendado: i === indice })))}
            />
            Plano recomendado
          </label>
          <label className="block text-sm font-semibold text-[#033473]">
            Franquia (GB)
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" inputMode="decimal" value={plano.franquiaGb} onChange={(evento) => alterar(indice, { franquiaGb: evento.target.value })} />
          </label>
          {plano.codigo !== "FREE" && (
            <div className="grid gap-2 sm:grid-cols-3">
              {PERIODOS.map(([periodo, rotulo]) => (
                <label key={periodo} className="text-sm font-semibold text-[#033473]">
                  Franquia {rotulo}
                  <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" value={plano.franquiaPor[periodo]} onChange={(evento) => alterar(indice, { franquiaPor: { ...plano.franquiaPor, [periodo]: evento.target.value } })}>
                    <option value="SEMANA">por semana</option>
                    <option value="MES">por mês</option>
                  </select>
                </label>
              ))}
            </div>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[#033473]">
              Retenção (dias)
              <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" inputMode="numeric" value={plano.retencaoDias} onChange={(evento) => alterar(indice, { retencaoDias: evento.target.value })} />
            </label>
            <label className="text-sm font-semibold text-[#033473]">
              Chamadas de IA por mês
              <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" inputMode="numeric" value={plano.chamadasIaMes} onChange={(evento) => alterar(indice, { chamadasIaMes: evento.target.value })} />
            </label>
          </div>
          <Limite rotulo="Membros" ilimitado={plano.membrosIlimitado} valor={plano.membros} aoMarcar={(marcado) => alterar(indice, { membrosIlimitado: marcado })} aoDigitar={(valor) => alterar(indice, { membros: valor })} />
          <Limite rotulo="Produtos" ilimitado={plano.produtosIlimitado} valor={plano.produtos} aoMarcar={(marcado) => alterar(indice, { produtosIlimitado: marcado })} aoDigitar={(valor) => alterar(indice, { produtos: valor })} />
          <label className="block text-sm font-semibold text-[#033473]">
            Painel
            <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" value={plano.dashboard} onChange={(evento) => alterar(indice, { dashboard: evento.target.value })}>
              {PAINEIS.map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
            </select>
          </label>
          <fieldset className="space-y-1">
            <legend className="text-sm font-semibold text-[#033473]">Recursos de análise</legend>
            {RECURSOS.map(([codigo, rotulo]) => (
              <label key={codigo} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={plano.recursosAnalise.includes(codigo)}
                  onChange={(evento) => {
                    const recursosAnalise = evento.target.checked
                      ? [...plano.recursosAnalise, codigo]
                      : plano.recursosAnalise.filter((item) => item !== codigo);
                    alterar(indice, { recursosAnalise });
                  }}
                />
                {rotulo}
              </label>
            ))}
          </fieldset>
          {plano.precos && PERIODOS.map(([periodo, rotulo]) => (
            <div key={periodo} className="grid gap-2 sm:grid-cols-3">
              {MEIOS.map(([meio, nome]) => (
                <label key={meio} className="text-sm font-semibold text-[#033473]">
                  {rotulo} no {nome} (R$)
                  <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" inputMode="decimal" value={plano.precos[periodo][meio]} onChange={(evento) => alterar(indice, { precos: { ...plano.precos, [periodo]: { ...plano.precos[periodo], [meio]: evento.target.value } } })} />
                </label>
              ))}
            </div>
          ))}
          {plano.gb && (
            <div className="grid gap-2 sm:grid-cols-3">
              {MEIOS.map(([meio, nome]) => (
                <label key={meio} className="text-sm font-semibold text-[#033473]">
                  GB a mais no {nome} (R$)
                  <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" inputMode="decimal" value={plano.gb[meio]} onChange={(evento) => alterar(indice, { gb: { ...plano.gb, [meio]: evento.target.value } })} />
                </label>
              ))}
            </div>
          )}
          {plano.extra && (
            <div className="grid gap-2 sm:grid-cols-3">
              {MEIOS.map(([meio, nome]) => (
                <label key={meio} className="text-sm font-semibold text-[#033473]">
                  Armazenamento extra no {nome} (R$)
                  <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" inputMode="decimal" value={plano.extra[meio]} onChange={(evento) => alterar(indice, { extra: { ...plano.extra, [meio]: evento.target.value } })} />
                </label>
              ))}
            </div>
          )}
        </fieldset>
      ))}
      <button type="submit" disabled={salvando} className="rounded-xl bg-[#0D65D9] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
        {salvando ? "Salvando..." : "Salvar catálogo"}
      </button>
    </form>
  );
}

function Limite({ rotulo, ilimitado, valor, aoMarcar, aoDigitar }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
      <label className="text-sm font-semibold text-[#033473]">
        {rotulo}
        <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" inputMode="numeric" value={valor} disabled={ilimitado} onChange={(evento) => aoDigitar(evento.target.value)} />
      </label>
      <label className="flex items-center gap-2 pb-2 text-sm text-slate-700">
        <input type="checkbox" checked={ilimitado} onChange={(evento) => aoMarcar(evento.target.checked)} />
        Ilimitado
      </label>
    </div>
  );
}
