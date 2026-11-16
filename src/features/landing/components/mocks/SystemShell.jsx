import symbol from "../../../../shared/assets/lhamalog-symbol.svg";

// Moldura do sistema usada em todas as telas de exemplo (FR-005): barra lateral azul-marinho #033473 com o símbolo e a navegação,
// e a área da página com o título, como no sistema desenhado no Figma (https://www.figma.com/design/e88SaMez3hQZ0nmmC3uEtm/LhamaLog).
// Rótulos da navegação: só nomes de áreas do produto (os títulos das próprias telas de exemplo, mais Dashboard, Produtos e Empresa).
// Abaixo de 1280 px a barra lateral mostra só os ícones (a tela fica estreita ao lado do texto e no celular), para caber em 375 px
// sem rolagem lateral (FR-012); de 1280 px em diante mostra os nomes. Decorativa: quem a lê é a moldura (MockFrame).
export const SYSTEM_NAV = ["Dashboard", "Ocorrências", "Logs", "Avisos", "Produtos", "Empresa"];

function NavIcon({ ativo }) {
  return (
    <span
      className={`h-4 w-4 shrink-0 rounded-[5px] ${ativo ? "bg-white" : "bg-[#C6DBF7]/70"}`}
    />
  );
}

export function SystemShell({ ativo, titulo, children }) {
  return (
    <div className="-m-4 flex sm:-m-5">
      <div className="flex w-12 shrink-0 flex-col gap-1 bg-[#033473] p-2 xl:w-40 xl:p-3">
        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white xl:h-9 xl:w-9">
          <img src={symbol} alt="" className="h-5 w-auto" />
        </div>
        {SYSTEM_NAV.map((nome) => {
          const isActive = nome === ativo;
          return (
            <div
              key={nome}
              className={`flex items-center gap-2 rounded-lg px-1.5 py-2 text-sm font-medium xl:px-2.5 ${
                isActive ? "bg-white/15 text-white" : "text-[#C6DBF7]"
              }`}
            >
              <NavIcon ativo={isActive} />
              <span className="hidden truncate xl:inline">{nome}</span>
            </div>
          );
        })}
      </div>
      <div className="min-w-0 flex-1 bg-[#F8FAFD] p-3 sm:p-4">
        <p className="text-lg font-bold leading-tight text-[#033473]">{titulo}</p>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
