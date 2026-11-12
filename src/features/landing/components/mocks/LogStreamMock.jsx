import { useEffect, useRef, useState } from "react";
import { LOG_LINES, SUPPORT_TEXTS } from "../../content";
import { landingBadge } from "../../landingTokens";
import { AI_EXAMPLES } from "./aiExamples";

// Janela dos logs do topo (FR-002, FR-023, FR-024, FR-015). Tudo fictício e montado só com elementos da página.
// Ciclo: as linhas de log aparecem uma a uma (como um terminal), a última é o erro em destaque, depois a IA mostra a hipótese
// de causa e a sugestão de correção; o resultado fica à mostra um tempo, a janela some de leve e o ciclo recomeça.
// Acessibilidade: a janela é lida como uma imagem com o texto aprovado da tela de sugestão por IA; o que corre fica escondido
// do leitor de tela. O botão de pausar fica FORA da área lida como imagem, para ser alcançado por Tab.
// Movimento reduzido: mostra o resultado completo e parado, sem o botão (não há o que pausar).
// Desempenho: só `opacity` e `transform` mudam; todas as linhas já ocupam o seu lugar desde o início (a altura não muda e a
// página não pula); os temporizadores param com a pausa, quando a janela sai da tela e quando o componente sai da página.
const LINE_MS = 650; // entre uma linha e a próxima
const CAUSE_MS = 900; // do erro até a hipótese de causa
const FIX_MS = 1100; // da causa até a sugestão de correção
const HOLD_MS = 4500; // resultado completo à mostra
const FADE_MS = 400; // a janela some de leve antes de recomeçar

const LAST_LINE = LOG_LINES.length; // passo em que todas as linhas estão à mostra
const STEP_CAUSE = LAST_LINE + 1;
const STEP_FIX = LAST_LINE + 2;
const EXAMPLE = AI_EXAMPLES.pedidos;

const LEVEL_COLOR = {
  INFO: "text-[#9CC2F9]",
  WARN: "text-[#FCD34D]",
  ERROR: "text-[#FCA5A5]",
};

function usePrefersReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia?.(query).matches,
  );
  useEffect(() => {
    const media = window.matchMedia?.(query);
    if (!media) return undefined;
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useInView(ref) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

// Classe de "aparecer": parado fica invisível e 8 px abaixo; ao aparecer sobe para o lugar. A transição só existe com
// movimento permitido; sem ela a troca é instantânea (e com movimento reduzido tudo já nasce visível).
const reveal = (visible) =>
  `motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out ${
    visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
  }`;

export function LogStreamMock() {
  const reduced = usePrefersReducedMotion();
  const frameRef = useRef(null);
  const inView = useInView(frameRef);
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0);
  const [fading, setFading] = useState(false);

  const running = !reduced && !paused && inView;

  useEffect(() => {
    if (!running) return undefined;
    let delay;
    let next;
    if (fading) {
      delay = FADE_MS;
      next = () => {
        setStep(0);
        setFading(false);
      };
    } else if (step < LAST_LINE) {
      delay = LINE_MS;
      next = () => setStep((value) => value + 1);
    } else if (step === LAST_LINE) {
      delay = CAUSE_MS;
      next = () => setStep(STEP_CAUSE);
    } else if (step === STEP_CAUSE) {
      delay = FIX_MS;
      next = () => setStep(STEP_FIX);
    } else {
      delay = HOLD_MS;
      next = () => setFading(true);
    }
    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [running, step, fading]);

  // Com movimento reduzido, o resultado completo.
  const shown = reduced ? STEP_FIX : step;
  const streaming = !reduced && shown < LAST_LINE;

  return (
    <figure className="m-0">
      <div className="relative" ref={frameRef}>
        <div
          role="img"
          aria-label={SUPPORT_TEXTS.telaSugestaoIa}
          className="overflow-hidden rounded-2xl border border-[#2A3145] bg-[#141826] shadow-[0_24px_48px_-20px_rgba(3,52,115,0.55)]"
        >
          <div aria-hidden="true">
            <div className="flex h-12 items-center gap-2 border-b border-white/10 px-4">
              <span className="h-3 w-3 rounded-full bg-[#FCA5A5]/70" />
              <span className="h-3 w-3 rounded-full bg-[#FCD34D]/70" />
              <span className="h-3 w-3 rounded-full bg-[#8FF0C4]/70" />
            </div>
            <div
              className={`p-4 sm:p-5 motion-safe:transition-opacity motion-safe:duration-300 ${
                fading ? "opacity-0" : "opacity-100"
              }`}
            >
              <ol className="space-y-1.5 font-mono text-sm leading-snug">
                {LOG_LINES.map((line, index) => {
                  const isError = line.nivel === "ERROR";
                  return (
                    <li
                      key={`${line.servico}-${line.mensagem}`}
                      className={`grid grid-cols-[3.75rem_minmax(0,5.5rem)_minmax(0,1fr)] items-baseline gap-x-2 rounded-md px-2 py-1 ${
                        isError ? "bg-[#3A1E25] ring-1 ring-[#FCA5A5]/40" : ""
                      } ${reveal(index < shown)}`}
                    >
                      <span className={`font-semibold ${LEVEL_COLOR[line.nivel]}`}>{line.nivel}</span>
                      <span className="truncate text-[#94A3B8]">{line.servico}</span>
                      <span className={`break-words ${isError ? "font-semibold text-[#F1F5F9]" : "text-[#E2E8F0]"}`}>
                        {line.mensagem}
                        {/* Cursor do terminal logo depois da última linha que chegou (decorativo; pisca só com movimento permitido). */}
                        {streaming && index === shown - 1 && (
                          <span className="ml-1.5 inline-block h-3.5 w-2 translate-y-0.5 bg-[#9CC2F9] motion-safe:animate-pulse" />
                        )}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-3 space-y-3 font-sans">
                <div className={`rounded-xl bg-white p-4 ${reveal(shown >= STEP_CAUSE)}`}>
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#033473]">
                    Hipótese de causa
                    <span
                      className={`rounded-full px-2 py-0.5 text-sm font-semibold leading-none ${landingBadge.info}`}
                    >
                      IA
                    </span>
                  </p>
                  <p className="mt-2 text-[15px] leading-snug text-[#141826]">{EXAMPLE.causa}</p>
                </div>
                <div className={`rounded-xl bg-white p-4 ${reveal(shown >= STEP_FIX)}`}>
                  <p className="text-sm font-semibold text-[#033473]">Sugestão de correção</p>
                  <p className="mt-2 text-[15px] leading-snug text-[#141826]">{EXAMPLE.correcao}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? SUPPORT_TEXTS.retomarAnimacao : SUPPORT_TEXTS.pausarAnimacao}
            title={paused ? SUPPORT_TEXTS.retomarAnimacao : SUPPORT_TEXTS.pausarAnimacao}
            className="absolute right-1 top-0.5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[#E2E8F0] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white motion-safe:transition-colors motion-safe:duration-150"
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-center text-sm text-slate-600">
        {SUPPORT_TEXTS.legendaTela}
      </figcaption>
    </figure>
  );
}
