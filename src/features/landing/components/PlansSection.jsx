import { useState } from "react";
import { contractUrl } from "../../../shared/appLinks";
import { usePlans } from "../../subscription/hooks/usePlans";
import { PlansCatalog } from "../../subscription/screens/public/PlansCatalog";
import { SUPPORT_TEXTS } from "../content";
import { landingSection, landingText } from "../landingTokens";
// Seção de planos (FR-007, T030): os mesmos cartões e o mesmo seletor da página de planos, sem duplicar regra de preço.
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
            <div className="space-y-3">
              <h2 id="planos-titulo" className={landingText.sectionTitle}>
                {SUPPORT_TEXTS.tituloPlanos}
              </h2>
              <p className={landingText.sectionIntro}>{SUPPORT_TEXTS.introPlanos}</p>
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
      </div>
    </section>
  );
}
