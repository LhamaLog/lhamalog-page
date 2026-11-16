import { FAQ, SUPPORT_TEXTS } from "../content";
import { landingSection, landingText } from "../landingTokens";
// Perguntas frequentes (FR-008, FR-013): sanfona com <details>/<summary> nativos. Teclado (Tab, Enter, Espaço), foco e o anúncio
// de "aberta" ou "fechada" já vêm do navegador. Nenhuma pergunta nasce aberta. Só a seta gira, e só com movimento permitido.
// Layout: título à esquerda (fixo ao rolar em tela larga) e lista de linhas separadas por filetes à direita, sem cartões.
export function Faq() {
  return (
    <section
      id="perguntas"
      aria-labelledby="perguntas-titulo"
      className={`${landingSection.anchor} ${landingSection.spacing} bg-white`}
    >
      <div
        className={`${landingSection.container} grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16`}
      >
        <h2
          id="perguntas-titulo"
          className={`${landingText.sectionTitle} lg:sticky lg:top-28 lg:self-start`}
        >
          {SUPPORT_TEXTS.tituloPerguntas}
        </h2>
        <div className="divide-y divide-[#D2E1F6] border-y border-[#D2E1F6]">
          {FAQ.map((item) => (
            <details key={item.pergunta} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-4 text-left text-base font-semibold leading-snug text-[#141826] hover:text-[#0D65D9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C70F2] sm:text-lg motion-safe:transition-colors motion-safe:duration-150 [&::-webkit-details-marker]:hidden">
                {item.pergunta}
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-[#033473] motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-180"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className={`${landingText.body} max-w-2xl pb-6 pr-9`}>{item.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
