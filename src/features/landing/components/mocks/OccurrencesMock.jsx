import { SUPPORT_TEXTS } from "../../content";
import { landingBadge } from "../../landingTokens";
import { MockFrame } from "./MockFrame";
import { SystemShell } from "./SystemShell";

// Tela de ocorrências no estilo do sistema desenhado no Figma ("01-Ocorrencias-Lista"): moldura do sistema (SystemShell), campo de
// busca e lista de ocorrências com um quadrado colorido por tipo (erro, aviso). Montada só com elementos da página, sem imagem do
// Figma, e decorativa (a moldura a lê como uma imagem; FR-005, FR-020). Dados fictícios (erros agrupados, com a quantidade de vezes).
const ROWS = [
  {
    tipo: "Erro",
    badge: landingBadge.error,
    quadrado: "bg-[#FDE8E8] text-[#9B1C1C]",
    titulo: "Tempo esgotado ao chamar o serviço de pagamentos",
    servico: "servico-pagamentos",
    vezes: "x 12",
  },
  {
    tipo: "Erro",
    badge: landingBadge.error,
    quadrado: "bg-[#FDE8E8] text-[#9B1C1C]",
    titulo: "Valor vazio ao criar o pedido",
    servico: "servico-pedidos",
    vezes: "x 5",
  },
  {
    tipo: "Aviso",
    badge: landingBadge.warning,
    quadrado: "bg-[#FEF3C7] text-[#92400E]",
    titulo: "Resposta lenta na consulta de usuários",
    servico: "servico-usuarios",
    vezes: "x 3",
  },
];

export function OccurrencesMock() {
  return (
    <MockFrame label={SUPPORT_TEXTS.telaOcorrencias} title="Ocorrências">
      <SystemShell ativo="Ocorrências" titulo="Ocorrências">
        <div className="h-8 rounded-lg border border-[#D2E1F6] bg-white" />
        <ul className="mt-3 space-y-2.5">
          {ROWS.map((row) => (
            <li
              key={row.titulo}
              className="flex items-center gap-3 rounded-xl border border-[#D2E1F6] bg-white p-3"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-bold ${row.quadrado}`}
              >
                !
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2">
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-sm font-semibold leading-none ${row.badge}`}
                  >
                    {row.tipo}
                  </span>
                  <span className="min-w-0 truncate text-sm text-slate-600">{row.servico}</span>
                </p>
                <p className="mt-1 text-[15px] font-semibold leading-snug text-[#141826]">
                  {row.titulo}
                </p>
              </div>
              <span className="shrink-0 rounded-lg bg-[#F3F7FD] px-2.5 py-1 text-sm font-semibold text-[#033473]">
                {row.vezes}
              </span>
            </li>
          ))}
        </ul>
      </SystemShell>
    </MockFrame>
  );
}
