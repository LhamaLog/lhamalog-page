import { signUpUrl } from "../../../shared/appLinks";
import { HERO } from "../content";
import { landingButton, landingSection } from "../landingTokens";
import { LogStreamMock } from "./mocks/LogStreamMock";
// Topo (FR-002): título grande, subtítulo, "Começar grátis" (cadastro), "Ver planos" (âncora) e a linha de oferta, com a janela
// animada dos logs (FR-023), que termina na sugestão por IA (o diferencial do produto), já na primeira tela.
// Layout: de 1024 px em diante, duas colunas (texto à esquerda, tela à direita, alinhados pelo centro); abaixo disso, uma coluna
// centralizada com a tela depois do texto. No código a ordem é sempre título, subtítulo, botões, linha de oferta e só então a
// tela, então a leitura por leitor de tela e por Tab segue a ordem visual nos dois layouts (FR-013).
// Fundo só com CSS (FR-018): degradê de branco para azul bem claro, com 3 brilhos arredondados em azul translúcido, na paleta
// do LhamaLog. O `overflow-hidden` da seção corta os brilhos que passam das bordas (sem rolagem lateral em 375 px) e o
// degradê termina em branco, para emendar com a seção seguinte. Os brilhos não têm animação.
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#EEF5FF] to-[#DCEBFF] pb-16 pt-32 sm:pb-24 sm:pt-40 lg:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#0C70F2]/20 blur-3xl sm:-left-10 sm:h-96 sm:w-96" />
        <div className="absolute -right-24 top-32 h-80 w-80 rounded-full bg-[#033473]/10 blur-3xl sm:-right-10 sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#BFD6F5]/70 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
      </div>

      <div
        className={`${landingSection.container} relative grid items-center gap-12 text-center lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 lg:text-left xl:gap-16`}
      >
        <div className="min-w-0">
          <h1 className="mx-auto max-w-4xl break-words text-[38px] font-extrabold leading-[1.08] tracking-[-0.02em] text-[#033473] sm:text-6xl lg:mx-0 lg:text-[44px] xl:text-[56px]">
            {HERO.titulo}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#141826] sm:text-xl lg:mx-0 lg:max-w-xl">
            {HERO.subtitulo}
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
            <a href={signUpUrl()} className={landingButton.primary}>
              {HERO.botaoPrincipal}
            </a>
            <a href="#planos" className={landingButton.outline}>
              {HERO.botaoSecundario}
            </a>
          </div>
          {/* text-balance: quando a linha quebra (por exemplo em 1024 px), as duas linhas ficam parecidas e "mensais" não fica sozinho. */}
          <p className="mt-5 text-sm font-medium leading-snug text-balance text-[#141826] sm:text-base">
            {HERO.oferta}
          </p>
        </div>

        {/* Janela dos logs, com a legenda "Exemplo ilustrativo" e o aria-label aprovados da tela de sugestão por IA (FR-020). */}
        <div className="mx-auto w-full min-w-0 max-w-xl text-left lg:mx-0 lg:max-w-none">
          <LogStreamMock />
        </div>
      </div>
    </section>
  );
}
