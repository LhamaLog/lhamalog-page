import { TAXAS_ASAAS, TAXAS_ASAAS_NOTA, TAXAS_ASAAS_TITULO } from "../../taxasAsaas";

// Faixa na largura da tela, abaixo dos cartões. As três taxas ficam lado a lado
// e cada uma ocupa um terço da largura, da borda esquerda à direita.
export function AsaasFees() {
  return (
    <section aria-labelledby="taxas-asaas-titulo" className="w-full border-y border-[#D2E1F6] bg-white">
      <div className="px-4 py-4 text-center sm:px-8">
        <h3 id="taxas-asaas-titulo" className="text-lg font-bold leading-tight text-[#033473]">
          {TAXAS_ASAAS_TITULO}
        </h3>
        <p className="mx-auto mt-1 max-w-4xl text-sm leading-snug text-slate-600 sm:text-base">{TAXAS_ASAAS_NOTA}</p>
      </div>
      <ul className="grid w-full grid-cols-3 border-t border-[#D2E1F6]">
        {TAXAS_ASAAS.map((taxa) => (
          <li
            key={taxa.meio}
            className="flex min-w-0 flex-col items-center justify-center gap-1 px-2 py-4 text-center sm:flex-row sm:gap-3 sm:px-6 sm:py-5 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-[#D2E1F6]"
          >
            <p className="text-sm font-semibold leading-snug text-[#033473] sm:text-base">{taxa.meio}</p>
            <p className="text-sm font-bold leading-snug text-[#141826] sm:text-lg">{taxa.valor}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
