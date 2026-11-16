import { SUPPORT_TEXTS } from "../../content";
import { landingBadge } from "../../landingTokens";
import { MockFrame } from "./MockFrame";
import { AI_EXAMPLES } from "./aiExamples";
import { SystemShell } from "./SystemShell";
// Na moldura do sistema (SystemShell). Os exemplos fictícios ficam em aiExamples.js (o "pedidos" também é usado pela janela dos logs do topo).
export function AiSuggestionMock({ example = "pedidos" }) {
  const data = AI_EXAMPLES[example];
  return (
    <MockFrame label={SUPPORT_TEXTS.telaSugestaoIa} title="Ocorrência">
      <SystemShell ativo="Ocorrências" titulo="Ocorrência">
        <div className="flex items-start gap-2">
          <span
            className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-sm font-semibold leading-none ${landingBadge.error}`}
          >
            Erro
          </span>
          <p className="min-w-0 text-[15px] font-semibold leading-snug text-[#141826]">{data.erro}</p>
        </div>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-[#D2E1F6] bg-[#F3F7FD] p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#033473]">
              Hipótese de causa
              <span
                className={`rounded-full px-2 py-0.5 text-sm font-semibold leading-none ${landingBadge.info}`}
              >
                IA
              </span>
            </p>
            <p className="mt-2 text-[15px] leading-snug text-[#141826]">{data.causa}</p>
          </div>
          <div className="rounded-xl border border-[#D2E1F6] bg-white p-4">
            <p className="text-sm font-semibold text-[#033473]">Sugestão de correção</p>
            <p className="mt-2 text-[15px] leading-snug text-[#141826]">{data.correcao}</p>
          </div>
        </div>
      </SystemShell>
    </MockFrame>
  );
}
