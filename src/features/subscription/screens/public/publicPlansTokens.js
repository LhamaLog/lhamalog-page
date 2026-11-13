// Cores, tipografia, botões e cartões da página pública de planos (/planos). Ficam num só lugar.
// Não usa os tokens das telas do sistema (a tela de dentro do sistema tem visual próprio). Fonte: Poppins da marca, vinda do SubscriptionLayout.
// Contrastes conferidos: texto #141826 sobre #F3F7FD 16:1; apoio #475569 sobre #F3F7FD 7:1; branco sobre #0D65D9 (azul dos botões cheios, paleta da marca) 5,41:1;
// branco sobre #033473 12:1; #BFD6F5 sobre #033473 7,6:1; link/botão #0D65D9 sobre branco 5,41:1.
// Escala tipográfica (nada abaixo de 14 px).
export const publicText = {
  pageTitle: "text-[34px] sm:text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-[#033473]",
  pageSubtitle: "text-base sm:text-lg font-normal leading-relaxed text-slate-700",
};
// Botões: mesma altura (48 px), borda de 2 px, mesmo raio e mesma fonte; 150 ms só quando o movimento está permitido.
const base =
  "inline-flex h-12 min-h-11 w-full cursor-pointer items-center justify-center rounded-xl border-2 px-4 text-base font-semibold leading-none motion-safe:transition-[color,background-color,border-color,box-shadow,transform] motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:not-disabled:-translate-y-0.5 motion-safe:active:not-disabled:translate-y-px hover:not-disabled:shadow-[0_10px_20px_-12px_rgba(13,101,217,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default";
export const publicButton = {
  // "Contratar": azul de ação #0D65D9 (o mesmo dos botões cheios da landing), hover #0B57BD. Desabilitado ("Plano atual") continua azul.
  primary: `${base} border-transparent bg-[#0D65D9] text-white hover:bg-[#0B57BD] focus-visible:outline-[#0C70F2] disabled:hover:bg-[#0D65D9]`,
  // No cartão azul escuro (Pro): o MESMO azul de ação do primário, com borda branca para se destacar do fundo.
  // Branco sobre #0D65D9 = 5,41:1; no hover escurece (#0B57BD, 6,75:1) e a borda branca mantém o contorno.
  onDark: `${base} border-white bg-[#0D65D9] text-white hover:bg-[#0B57BD] focus-visible:outline-white disabled:hover:bg-[#0D65D9]`,
  // "Começar grátis": branco, borda e texto azuis; hover com fundo azul bem claro.
  outline: `${base} border-[#0C70F2] bg-white text-[#0D65D9] hover:bg-[#EEF5FF] focus-visible:outline-[#0C70F2]`,
};
// Cartões: duas "roupas" (comum e destaque). Todas as classes de cor de cada uma ficam juntas.
export const publicCard = {
  base: "relative grid row-span-6 grid-rows-subgrid gap-y-0 rounded-2xl border p-6 2xl:p-7",
  plain: {
    surface:
      "border-[#D2E1F6] bg-[#F3F7FD] text-[#141826] shadow-[0_1px_2px_rgba(8,59,122,0.05),0_8px_20px_-10px_rgba(8,59,122,0.12)] motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[0_2px_4px_rgba(8,59,122,0.06),0_16px_30px_-12px_rgba(8,59,122,0.22)]",
    name: "text-[#033473]",
    text: "text-slate-600",
    price: "text-[#033473]",
    muted: "text-slate-600",
    divider: "border-[#D2E1F6]",
    item: "text-[#141826]",
    check: "bg-[#D7F6EA] text-[#0E8F5C]",
    trial: "bg-[#D7F6EA] text-[#0B5F3F]",
  },
  featured: {
    surface:
      "border-[#033473] bg-[#033473] text-white shadow-[0_2px_4px_rgba(3,52,115,0.18),0_20px_36px_-12px_rgba(3,52,115,0.5)] motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 motion-safe:hover:-translate-y-0.5",
    name: "text-white",
    text: "text-[#C6DBF7]",
    price: "text-white",
    muted: "text-[#C6DBF7]",
    divider: "border-white/20",
    item: "text-white",
    check: "bg-white/15 text-[#8FF0C4]",
    trial: "bg-white/15 text-[#B6F5D8]",
  },
};
