import { SUPPORT_TEXTS } from "../../content";
// Moldura das telas de exemplo (FR-005, FR-020): montada só com elementos da página, sem imagens.
// A tela inteira é lida como uma imagem com o texto de apoio; o conteúdo interno é decorativo (aria-hidden).
// A legenda "Exemplo ilustrativo" fica visível logo abaixo.
export function MockFrame({ label, title, children }) {
  return (
    <figure className="m-0">
      <div
        role="img"
        aria-label={label}
        className="overflow-hidden rounded-2xl border border-[#D2E1F6] bg-white shadow-[0_20px_40px_-20px_rgba(8,59,122,0.35)]"
      >
        <div aria-hidden="true">
          <div className="flex items-center gap-2 border-b border-[#D2E1F6] bg-[#F3F7FD] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#BFD6F5]" />
            <span className="h-3 w-3 rounded-full bg-[#BFD6F5]" />
            <span className="h-3 w-3 rounded-full bg-[#BFD6F5]" />
            <span className="ml-3 truncate text-sm font-medium text-slate-600">{title}</span>
          </div>
          <div className="p-4 sm:p-5">{children}</div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm text-slate-600">
        {SUPPORT_TEXTS.legendaTela}
      </figcaption>
    </figure>
  );
}
