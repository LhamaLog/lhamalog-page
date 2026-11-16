import { SUPPORT_TEXTS } from "../../content";
import { landingBadge } from "../../landingTokens";
import { MockFrame } from "./MockFrame";
import { SystemShell } from "./SystemShell";

// Linhas de log fictícias: só aparecem valores já mascarados, nunca dados reais. Na moldura do sistema (SystemShell).
const LINES = [
  { hora: "10:42:07", texto: "login ok usuario=•••••••• documento=•••••••••••" },
  { hora: "10:42:09", texto: "pedido criado cliente=•••••••• telefone=••••••••••" },
  { hora: "10:42:12", texto: "falha no pagamento cartao=•••• •••• •••• ••••" },
];
export function MaskedDataMock() {
  return (
    <MockFrame label={SUPPORT_TEXTS.telaDadosMascarados} title="Logs">
      <SystemShell ativo="Logs" titulo="Logs">
        <ul className="space-y-2.5">
          {LINES.map((line) => (
            <li key={line.hora} className="rounded-xl border border-[#D2E1F6] bg-white p-3">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="text-sm font-medium text-slate-600">{line.hora}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-sm font-semibold leading-none ${landingBadge.ok}`}
                >
                  mascarado
                </span>
              </p>
              <p className="mt-1.5 break-words font-mono text-sm leading-relaxed text-[#141826]">
                {line.texto}
              </p>
            </li>
          ))}
        </ul>
      </SystemShell>
    </MockFrame>
  );
}
