import { HOW_IT_WORKS } from "../content";
import { landingCard, landingSection, landingText } from "../landingTokens";
// Como funciona (FR-004): 3 cards. Âncora #como-funciona com margem de rolagem maior que a barra (FR-011).
export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-titulo"
      className={`${landingSection.anchor} ${landingSection.spacing} bg-white`}
    >
      <div className={landingSection.container}>
        <h2 id="como-funciona-titulo" className={`${landingText.sectionTitle} text-center`}>
          {HOW_IT_WORKS.titulo}
        </h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.cards.map((card, index) => (
            <li
              key={card.titulo}
              className={`${landingCard.base} motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[0_16px_30px_-14px_rgba(8,59,122,0.25)]`}
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0C70F2] text-base font-bold text-white"
              >
                {index + 1}
              </span>
              <h3 className="mt-5 text-xl font-bold leading-tight text-[#033473]">{card.titulo}</h3>
              <p className={`${landingText.body} mt-3`}>{card.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
