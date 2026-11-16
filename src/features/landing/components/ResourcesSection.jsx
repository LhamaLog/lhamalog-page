import { useState } from "react";
import mark from "../../../shared/assets/lhamalog-mark.png";
import { FEATURES, SUPPORT_TEXTS } from "../content";
import { landingSection, landingText } from "../landingTokens";

function FeatureIcon({ id }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  if (id === "ocorrencias") {
    return (
      <svg {...props}>
        <path d="M8 6h13M8 12h13M8 18h13" />
        <path d="M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    );
  }
  if (id === "sugestao-ia") {
    return (
      <svg {...props}>
        <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
        <path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14z" />
      </svg>
    );
  }
  if (id === "dados-mascarados") {
    return (
      <svg {...props}>
        <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M4 5l16 14" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

// Recursos (FR-005): a pessoa escolhe um recurso. O texto aprovado fica como contexto e a tela do sistema
// mostra como aquilo aparece no produto. Abaixo de 1024 px a tela vem logo depois do recurso escolhido;
// a partir daí, a lista fica à esquerda e a simulação à direita.
export function ResourcesSection({ screens }) {
  const [selected, setSelected] = useState(FEATURES[0].id);
  const current = FEATURES.find((feature) => feature.id === selected) ?? FEATURES[0];
  return (
    <section
      id="recursos"
      aria-labelledby="recursos-titulo"
      className={`${landingSection.anchor} ${landingSection.spacing} bg-[#F2F2F2]`}
    >
      <div className={landingSection.container}>
        <h2 id="recursos-titulo" className={`${landingText.sectionTitle} text-center`}>
          {SUPPORT_TEXTS.tituloRecursos}
        </h2>
        <div className="mt-10 grid items-start gap-6 lg:mt-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          <div className="space-y-3">
            {FEATURES.map((feature) => {
              const isSelected = feature.id === selected;
              return (
                <article
                  key={feature.id}
                  className={`rounded-2xl border-2 bg-white motion-safe:transition-[border-color,box-shadow] motion-safe:duration-150 ${
                    isSelected
                      ? "border-[#0C70F2] shadow-[0_16px_32px_-20px_rgba(12,112,242,0.55)]"
                      : "border-[#D2E1F6]"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelected(feature.id)}
                      className="flex w-full cursor-pointer items-start gap-3 rounded-2xl p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C70F2] sm:gap-4 sm:p-5"
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          isSelected ? "bg-[#0D65D9] text-white" : "bg-[#EEF5FF] text-[#033473]"
                        }`}
                      >
                        <FeatureIcon id={feature.id} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-lg font-bold leading-tight text-[#033473] sm:text-xl">
                          {feature.titulo}
                        </span>
                        <span className="mt-1.5 block text-lg leading-relaxed text-[#141826]">
                          {feature.texto}
                        </span>
                      </span>
                    </button>
                  </h3>
                  {isSelected && <div className="px-4 pb-4 sm:px-5 sm:pb-5 lg:hidden">{screens[feature.id]}</div>}
                </article>
              );
            })}
          </div>

          <div className="hidden min-w-0 lg:block" aria-live="polite">
            <div
              className="sticky top-28 overflow-hidden rounded-[28px] border border-[#D2E1F6] bg-[#EEF5FF] p-5 shadow-[0_24px_48px_-28px_rgba(8,59,122,0.45)] xl:p-7"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(12,112,242,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(12,112,242,0.08) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            >
              <img
                src={mark}
                alt=""
                width={273}
                height={360}
                className="mx-auto mb-4 h-14 w-auto"
              />
              {screens[current.id]}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
