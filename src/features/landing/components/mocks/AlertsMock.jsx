import { SUPPORT_TEXTS } from "../../content";
import { landingBadge } from "../../landingTokens";
import { MockFrame } from "./MockFrame";
import { SystemShell } from "./SystemShell";

// Avisos fictícios, só para ilustrar o aviso à equipe por e-mail e por push. Na moldura do sistema (SystemShell).
export function AlertsMock() {
  return (
    <MockFrame label={SUPPORT_TEXTS.telaAlertas} title="Avisos">
      <SystemShell ativo="Avisos" titulo="Avisos">
        <div className="space-y-3">
          <div className="rounded-xl border border-[#D2E1F6] bg-white p-3.5">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span
                className={`rounded-full px-2.5 py-1 text-sm font-semibold leading-none ${landingBadge.info}`}
              >
                E-mail
              </span>
              <span className="text-sm text-slate-600">Para: equipe de pagamentos</span>
            </p>
            <p className="mt-2 text-[15px] font-semibold leading-snug text-[#141826]">
              Nova ocorrência em servico-pagamentos
            </p>
            <p className="mt-1 text-sm leading-snug text-slate-600">
              Tempo esgotado ao chamar o serviço de pagamentos.
            </p>
          </div>
          <div className="rounded-xl border border-[#D2E1F6] bg-[#F3F7FD] p-3.5">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span
                className={`rounded-full px-2.5 py-1 text-sm font-semibold leading-none ${landingBadge.ok}`}
              >
                Push
              </span>
              <span className="text-sm text-slate-600">No celular</span>
            </p>
            <p className="mt-2 text-[15px] font-semibold leading-snug text-[#141826]">
              servico-pedidos: valor vazio ao criar o pedido
            </p>
          </div>
        </div>
      </SystemShell>
    </MockFrame>
  );
}
