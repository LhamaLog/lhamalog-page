import { useEffect, useRef, useState } from "react";
import wordmark from "../../../shared/assets/lhamalog-wordmark.png";
import { usePlans } from "../../subscription/hooks/usePlans";
import { PlansCatalog } from "../../subscription/screens/public/PlansCatalog";
import { SUPPORT_TEXTS } from "../content";
import { landingSection, landingText } from "../landingTokens";

function hostLocal() {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

// O formulário e o texto do link só existem no ramo de desenvolvimento. O build publicado elimina esse ramo.
function AjusteDev({ catalogo, onSaved }) {
  const [Formulario, setFormulario] = useState(null);
  const [aberto, setAberto] = useState(() => window.location.hash === "#ajustar-planos");
  useEffect(() => {
    if (!hostLocal()) return undefined;
    const aoMudar = () => setAberto(window.location.hash === "#ajustar-planos");
    window.addEventListener("hashchange", aoMudar);
    return () => window.removeEventListener("hashchange", aoMudar);
  }, []);
  useEffect(() => {
    if (!hostLocal() || !aberto) return undefined;
    let ativo = true;
    import("../../subscription/screens/dev/AjustePlanos.jsx").then((modulo) => {
      if (ativo) setFormulario(() => modulo.AjustePlanos);
    });
    return () => {
      ativo = false;
    };
  }, [aberto]);
  if (!hostLocal()) return null;
  return (
    <div className="space-y-4">
      <a href="#ajustar-planos" className="inline-block text-sm font-semibold text-[#0D65D9]">
        Ajustar planos
      </a>
      {aberto && Formulario && catalogo ? <Formulario catalogo={catalogo} onSaved={onSaved} /> : null}
    </div>
  );
}

const PAGINA_ASAAS = /^https:\/\/(?:sandbox\.asaas\.com|asaas\.com)\/checkoutSession\/show\?id=[A-Za-z0-9_-]+$/;
const AVISOS = {
  documento: "Informe um CPF ou CNPJ válido.",
  assinatura: "Este CPF ou CNPJ já tem uma assinatura ativa.",
  indisponivel: null,
};

// Seção de planos: os mesmos cartões e o mesmo seletor, sem duplicar regra de preço.
// "Contratar" pede o checkout à própria página e, se ele abrir, vai ao Asaas. Sem checkout, mostra "indisponível".
export function PlansSection() {
  const state = usePlans();
  const [aviso, setAviso] = useState(null);
  const [documento, setDocumento] = useState("");
  const emCurso = useRef(false);
  const subscribe = (plan, period) => {
    if (emCurso.current) return;
    const digitos = documento.replace(/\D/g, "");
    if (digitos.length !== 11 && digitos.length !== 14) {
      setAviso("documento");
      return;
    }
    emCurso.current = true;
    setAviso(null);
    fetch("/api/contratacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plano: plan.codigo, periodo: period, documento }),
    })
      .then(async (resposta) => {
        const corpo = await resposta.json().catch(() => ({}));
        if (resposta.status === 409 && corpo?.assinaturaAtiva) {
          emCurso.current = false;
          setAviso("assinatura");
          return null;
        }
        if (resposta.status === 400 && corpo?.documentoInvalido) {
          emCurso.current = false;
          setAviso("documento");
          return null;
        }
        if (!resposta.ok) throw new Error("indisponivel");
        return corpo;
      })
      .then((corpo) => {
        if (!corpo) return;
        const url = typeof corpo?.url === "string" ? corpo.url : "";
        if (PAGINA_ASAAS.test(url)) {
          window.location.assign(url);
          return;
        }
        emCurso.current = false;
        setAviso("indisponivel");
      })
      .catch(() => {
        emCurso.current = false;
        setAviso("indisponivel");
      });
  };
  return (
    <section
      id="planos"
      aria-labelledby="planos-titulo"
      className={`${landingSection.anchor} ${landingSection.spacing} bg-[#F2F2F2]`}
    >
      <div className={`${landingSection.wideContainer} space-y-8`}>
        <PlansCatalog
          state={state}
          onSubscribe={subscribe}
          header={
            <div className="space-y-4">
              <img
                src={wordmark}
                alt=""
                width={762}
                height={180}
                className="mx-auto h-10 w-auto sm:h-12"
              />
              <div className="space-y-3">
                <h2 id="planos-titulo" className={landingText.sectionTitle}>
                  {SUPPORT_TEXTS.tituloPlanos}
                </h2>
                <p className={`${landingText.sectionIntro} mx-auto max-w-3xl`}>
                  {SUPPORT_TEXTS.introPlanos}
                </p>
              </div>
            </div>
          }
          notice={
            <div className="mx-auto max-w-xl space-y-4">
              <label className="block text-left">
                <span className="mb-2 block text-sm font-semibold text-[#141826]">CPF ou CNPJ</span>
                <input
                  value={documento}
                  onChange={(evento) => {
                    setDocumento(evento.target.value);
                    setAviso(null);
                  }}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={18}
                  placeholder="Somente números"
                  aria-invalid={aviso === "documento"}
                  className="w-full rounded-xl border border-[#D2E1F6] bg-white px-4 py-3 text-base text-[#141826] outline-none focus:border-[#0D65D9]"
                />
              </label>
              {aviso ? (
                <p
                  role="status"
                  className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-base text-amber-900"
                >
                  {aviso === "indisponivel" ? SUPPORT_TEXTS.contratarIndisponivel : AVISOS[aviso]}
                </p>
              ) : null}
            </div>
          }
        />
        {import.meta.env.DEV ? <AjusteDev catalogo={state.data} onSaved={state.reload} /> : null}
      </div>
    </section>
  );
}
