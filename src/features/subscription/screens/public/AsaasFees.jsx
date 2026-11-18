import { TAXAS_ASAAS, TAXAS_ASAAS_NOTA, TAXAS_ASAAS_TITULO } from "../../taxasAsaas";

// Quadro único da seção de planos. As três taxas valem para todos os planos pagos,
// então ficam fora dos cartões (a grade alinha as linhas entre os cinco planos).
export function AsaasFees() {
  return (
    <section
      aria-labelledby="taxas-asaas-titulo"
      className="mx-auto w-full max-w-3xl rounded-2xl border border-[#D2E1F6] bg-white p-5 text-left shadow-[0_10px_24px_-18px_rgba(8,59,122,0.55)] sm:p-6"
    >
      <h3 id="taxas-asaas-titulo" className="text-lg font-bold leading-tight text-[#033473]">
        {TAXAS_ASAAS_TITULO}
      </h3>
      <p className="mt-2 text-sm leading-snug text-slate-600 sm:text-base">{TAXAS_ASAAS_NOTA}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {TAXAS_ASAAS.map((taxa) => (
          <li key={taxa.meio} className="rounded-xl bg-[#F3F7FD] px-3.5 py-3">
            <p className="text-sm font-semibold leading-snug text-[#033473]">{taxa.meio}</p>
            <p className="mt-1 text-base font-bold leading-snug text-[#141826]">{taxa.valor}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
