import { useEffect, useState } from "react";
import { contractUrl } from "../../../shared/appLinks";
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

// Seção de planos: os mesmos cartões e o mesmo seletor, sem duplicar regra de preço.
// "Contratar" leva ao cadastro no app com o plano e a periodicidade escolhidos; sem o app configurado, mostra "indisponível".
export function PlansSection() {
  const state = usePlans();
  const [unavailable, setUnavailable] = useState(false);
  const subscribe = (plan, period) => {
    const url = contractUrl(plan.codigo, period);
    if (url) window.location.assign(url);
    else setUnavailable(true);
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
            unavailable ? (
              <p
                role="status"
                className="mx-auto max-w-xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-base text-amber-900"
              >
                {SUPPORT_TEXTS.contratarIndisponivel}
              </p>
            ) : null
          }
        />
        {import.meta.env.DEV ? <AjusteDev catalogo={state.data} onSaved={state.reload} /> : null}
      </div>
    </section>
  );
}
