import { landingText } from "../landingTokens";
// Bloco alternado de texto + tela do produto (FR-005). Em tela estreita fica em uma coluna (texto e depois a tela).
export function FeatureBlock({ titulo, texto, invertido, children }) {
  return (
    <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div
        className={invertido ? "lg:col-start-2 lg:row-start-1" : "lg:col-start-1 lg:row-start-1"}
      >
        <h3 className="text-2xl font-bold leading-tight tracking-[-0.01em] text-[#033473] sm:text-3xl">
          {titulo}
        </h3>
        <p className={`${landingText.sectionIntro} mt-4 max-w-xl`}>{texto}</p>
      </div>
      <div
        className={
          invertido
            ? "min-w-0 lg:col-start-1 lg:row-start-1"
            : "min-w-0 lg:col-start-2 lg:row-start-1"
        }
      >
        {children}
      </div>
    </article>
  );
}
