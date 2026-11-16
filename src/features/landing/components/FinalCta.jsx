import { signUpUrl } from "../../../shared/appLinks";
import mark from "../../../shared/assets/lhamalog-mark.png";
import { FINAL_CTA } from "../content";
import { landingButton, landingSection } from "../landingTokens";
// Chamada final (FR-009): fundo escuro da paleta (#141826), sem brilhos, título e frase em branco e "Começar grátis" (cadastro).
export function FinalCta() {
  return (
    <section
      aria-labelledby="chamada-final-titulo"
      className="bg-[#141826] py-20 sm:py-28"
    >
      <div className={`${landingSection.container} text-center`}>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white sm:h-[4.5rem] sm:w-[4.5rem]">
          <img src={mark} alt="" width={273} height={360} className="h-12 w-auto" />
        </div>
        <h2
          id="chamada-final-titulo"
          className="mx-auto max-w-3xl break-words text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl"
        >
          {FINAL_CTA.titulo}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-xl leading-relaxed text-white sm:text-2xl">
          {FINAL_CTA.frase}
        </p>
        <div className="mt-10 flex justify-center">
          <a href={signUpUrl()} className={`${landingButton.onDark} w-full sm:w-auto`}>
            {FINAL_CTA.botao}
          </a>
        </div>
      </div>
    </section>
  );
}
