// Cores, botões e seções da landing. Reaproveita só os valores de cor já usados em /planos (publicPlansTokens.ts: paleta azul
// do Drive e Poppins da marca). Fica sem importações para o `node --test` poder ler a lista de contrastes.
// Animações só com `motion-safe:` (FR-015); nada abaixo de 14 px de texto.
export const LANDING_COLORS = {
  ink: "#141826",
  inkSoft: "#334155",
  muted: "#475569",
  navy: "#033473",
  navyDeep: "#033473",
  brand: "#0C70F2",
  brandHover: "#0B57BD",
  action: "#0D65D9",
  link: "#0D65D9",
  soft: "#F3F7FD",
  softBorder: "#D2E1F6",
  onDarkSoft: "#C6DBF7",
  codeBg: "#0B1B3A",
  codeText: "#E2E8F0",
  codeKey: "#9CC2F9",
  codePlaceholder: "#8FF0C4",
  white: "#FFFFFF",
  section: "#F2F2F2",
  logBg: "#141826",
  logText: "#E2E8F0",
  logService: "#94A3B8",
  logInfo: "#9CC2F9",
  logWarn: "#FCD34D",
  logError: "#FCA5A5",
  logErrorBg: "#3A1E25",
};
// Pares texto/fundo usados na landing, conferidos em tests/landing-contrast.test.mjs (mínimo 4,5:1; FR-014, SC-005).
// Inclui o texto desativado "em breve" do rodapé (sobre o fundo branco da página).
export const LANDING_CONTRAST_PAIRS = [
  { nome: "texto principal sobre branco", texto: LANDING_COLORS.ink, fundo: LANDING_COLORS.white },
  {
    nome: "texto de apoio sobre branco",
    texto: LANDING_COLORS.inkSoft,
    fundo: LANDING_COLORS.white,
  },
  {
    nome: "texto principal sobre cartão claro",
    texto: LANDING_COLORS.ink,
    fundo: LANDING_COLORS.soft,
  },
  {
    nome: "texto de apoio sobre cartão claro",
    texto: LANDING_COLORS.muted,
    fundo: LANDING_COLORS.soft,
  },
  { nome: "título azul sobre branco", texto: LANDING_COLORS.navy, fundo: LANDING_COLORS.white },
  {
    nome: "link e botão de contorno sobre branco",
    texto: LANDING_COLORS.link,
    fundo: LANDING_COLORS.white,
  },
  { nome: "botão de contorno com mouse em cima", texto: LANDING_COLORS.link, fundo: "#EEF5FF" },
  // Botões cheios usam o #0D65D9 da paleta da marca (5,41:1 com texto branco; FR-018); com o mouse em cima, #0B57BD (6,75:1).
  { nome: "botão principal", texto: LANDING_COLORS.white, fundo: LANDING_COLORS.action },
  {
    nome: "botão principal com mouse em cima",
    texto: LANDING_COLORS.white,
    fundo: LANDING_COLORS.brandHover,
  },
  {
    nome: "botão sobre fundo azul escuro",
    texto: LANDING_COLORS.white,
    fundo: LANDING_COLORS.action,
  },
  {
    nome: "botão sobre fundo azul escuro com mouse em cima",
    texto: LANDING_COLORS.white,
    fundo: LANDING_COLORS.brandHover,
  },
  { nome: "texto sobre azul escuro", texto: LANDING_COLORS.white, fundo: LANDING_COLORS.navyDeep },
  {
    nome: "texto de apoio sobre azul escuro",
    texto: LANDING_COLORS.onDarkSoft,
    fundo: LANDING_COLORS.navyDeep,
  },
  { nome: "exemplo de código", texto: LANDING_COLORS.codeText, fundo: LANDING_COLORS.codeBg },
  {
    nome: "exemplo de código: nome da variável",
    texto: LANDING_COLORS.codeKey,
    fundo: LANDING_COLORS.codeBg,
  },
  {
    nome: "exemplo de código: marcador a trocar",
    texto: LANDING_COLORS.codePlaceholder,
    fundo: LANDING_COLORS.codeBg,
  },
  {
    nome: "pergunta frequente com mouse em cima",
    texto: LANDING_COLORS.link,
    fundo: LANDING_COLORS.white,
  },
  { nome: "seta da pergunta frequente", texto: LANDING_COLORS.navy, fundo: LANDING_COLORS.white },
  {
    nome: "título da chamada final sobre azul-marinho",
    texto: LANDING_COLORS.white,
    fundo: LANDING_COLORS.navyDeep,
  },
  {
    nome: "contorno de foco sobre branco",
    texto: LANDING_COLORS.brand,
    fundo: LANDING_COLORS.white,
  },
  { nome: "link da barra", texto: "#0B1B3A", fundo: LANDING_COLORS.white },
  {
    nome: 'link "Entrar" compacto da barra (abaixo de 1024 px)',
    texto: LANDING_COLORS.action,
    fundo: LANDING_COLORS.white,
  },
  { nome: "título do topo sobre brilho azul", texto: LANDING_COLORS.navy, fundo: "#C2DBFC" },
  { nome: "subtítulo do topo sobre brilho azul", texto: LANDING_COLORS.inkSoft, fundo: "#C2DBFC" },
  {
    nome: 'legenda "Exemplo ilustrativo" da tela do topo sobre brilho azul',
    texto: LANDING_COLORS.muted,
    fundo: "#C2DBFC",
  },
  { nome: "etiqueta de erro", texto: "#9B1C1C", fundo: "#FDE8E8" },
  { nome: "etiqueta de aviso", texto: "#92400E", fundo: "#FEF3C7" },
  { nome: "etiqueta de ok", texto: "#0B5F3F", fundo: "#D7F6EA" },
  { nome: "etiqueta de informação", texto: "#033473", fundo: "#DCEBFF" },
  {
    nome: "texto de apoio sobre branco nas telas de exemplo",
    texto: LANDING_COLORS.muted,
    fundo: LANDING_COLORS.white,
  },
  // Fundo de seção #F2F2F2 da paleta ("Como funciona" e "Perguntas frequentes").
  { nome: "texto principal sobre o fundo de seção", texto: LANDING_COLORS.ink, fundo: LANDING_COLORS.section },
  { nome: "texto de apoio sobre o fundo de seção", texto: LANDING_COLORS.inkSoft, fundo: LANDING_COLORS.section },
  { nome: "título sobre o fundo de seção", texto: LANDING_COLORS.navy, fundo: LANDING_COLORS.section },
  { nome: "pergunta com mouse em cima sobre o fundo de seção", texto: LANDING_COLORS.link, fundo: LANDING_COLORS.section },
  // Tela de ocorrências no estilo do Figma (barra lateral #033473 e área #F8FAFD).
  { nome: "tela de ocorrências: item da barra lateral", texto: "#C6DBF7", fundo: LANDING_COLORS.navyDeep },
  { nome: "tela de ocorrências: item ativo da barra lateral", texto: LANDING_COLORS.white, fundo: "#254B88" },
  { nome: "tela de ocorrências: título da página", texto: LANDING_COLORS.navyDeep, fundo: "#F8FAFD" },
  // Janela dos logs do topo (FR-023): fundo #141826.
  { nome: "janela dos logs: mensagem", texto: LANDING_COLORS.logText, fundo: LANDING_COLORS.logBg },
  { nome: "janela dos logs: serviço", texto: LANDING_COLORS.logService, fundo: LANDING_COLORS.logBg },
  { nome: "janela dos logs: nível INFO", texto: LANDING_COLORS.logInfo, fundo: LANDING_COLORS.logBg },
  { nome: "janela dos logs: nível WARN", texto: LANDING_COLORS.logWarn, fundo: LANDING_COLORS.logBg },
  { nome: "janela dos logs: nível ERROR", texto: LANDING_COLORS.logError, fundo: LANDING_COLORS.logBg },
  { nome: "janela dos logs: linha de erro em destaque", texto: LANDING_COLORS.logError, fundo: LANDING_COLORS.logErrorBg },
  { nome: "janela dos logs: mensagem da linha de erro", texto: "#F1F5F9", fundo: LANDING_COLORS.logErrorBg },
  { nome: "janela dos logs: botão de pausar", texto: LANDING_COLORS.logText, fundo: LANDING_COLORS.logBg },
  // Chamada final e rodapé com fundo #141826 (FR-009, FR-027).
  { nome: "chamada final: título e frase", texto: LANDING_COLORS.white, fundo: LANDING_COLORS.logBg },
  { nome: "rodapé: textos, Termos e Política sem link e ícones sem link", texto: "#CBD5E1", fundo: LANDING_COLORS.logBg },
  { nome: "rodapé: links e ícones com link", texto: LANDING_COLORS.white, fundo: LANDING_COLORS.logBg },
  { nome: "rodapé: ícone sobre o círculo claro (#1F2331)", texto: "#CBD5E1", fundo: "#1F2331" },
  { nome: "parágrafo sobre o fundo de seção", texto: LANDING_COLORS.ink, fundo: LANDING_COLORS.section },
];
// Botões: mesma altura (48 px), borda de 2 px e raio do /planos, mas com largura própria (o do /planos é w-full, feito para o cartão).
// Animação discreta (FR-025): com o mouse em cima sobe 2 px, escurece e ganha sombra; ao clicar afunda 1 px. Só `transform` e sombra
// (o tamanho não muda e nada em volta se mexe); o movimento só com `motion-safe:` (FR-015).
const buttonBase =
  "inline-flex h-12 min-h-11 cursor-pointer items-center justify-center rounded-xl border-2 px-6 text-base font-semibold leading-none motion-safe:transition-[color,background-color,border-color,box-shadow,transform] motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-px hover:shadow-[0_10px_20px_-12px_rgba(13,101,217,0.7)] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2";
export const landingButton = {
  primary: `${buttonBase} border-transparent bg-[#0D65D9] text-white hover:bg-[#0B57BD] focus-visible:outline-[#0C70F2]`,
  outline: `${buttonBase} border-[#0C70F2] bg-white text-[#0D65D9] hover:bg-[#EEF5FF] focus-visible:outline-[#0C70F2]`,
  onDark: `${buttonBase} border-white bg-[#0D65D9] text-white hover:bg-[#0B57BD] focus-visible:outline-white`,
};
export const landingText = {
  sectionTitle: "text-[30px] sm:text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-[#033473]",
  sectionIntro: "text-lg sm:text-xl leading-relaxed text-[#141826]",
  body: "text-lg leading-relaxed text-[#141826]",
  disabled: "text-[#475569]",
};
// Seção: margem de rolagem maior que a barra flutuante, para o título não ficar atrás dela (FR-011).
export const landingSection = {
  anchor: "scroll-mt-28",
  container: "mx-auto w-full max-w-[1280px] px-4 sm:px-8",
  wideContainer: "mx-auto w-full max-w-[1600px] px-4 sm:px-8",
  spacing: "py-16 sm:py-24",
};
export const landingCard = {
  base: "rounded-2xl border border-[#D2E1F6] bg-[#F3F7FD] p-6 text-[#141826]",
  code: "overflow-x-auto rounded-2xl bg-[#0B1B3A] p-5 text-sm leading-relaxed text-[#E2E8F0]",
};
// Botões e links da barra flutuante: altura de 44 px (alvo de toque) e texto de 14 px.
// A base não traz `display`: quem usa escolhe `inline-flex` ou `hidden` sem uma classe vencer a outra (antes, o `inline-flex`
// da base anulava o `hidden` do "Entrar" abaixo de 1024 px e empurrava o botão do menu para fora da tela).
const navButtonBase =
  "h-11 min-h-11 cursor-pointer items-center justify-center rounded-full border-2 px-2 text-sm font-semibold leading-none whitespace-nowrap min-[460px]:px-3 sm:px-5 motion-safe:transition-[color,background-color,border-color,box-shadow,transform] motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-px hover:shadow-[0_10px_20px_-12px_rgba(13,101,217,0.7)] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2";
export const landingNav = {
  primary: `inline-flex ${navButtonBase} border-transparent bg-[#0D65D9] text-white hover:bg-[#0B57BD] focus-visible:outline-[#0C70F2]`,
  // "Entrar": um só elemento na barra. Abaixo de 1024 px é link compacto (azul de ação, negrito, sublinhado ao passar o mouse,
  // 44 px de altura para o toque); de 1024 px em diante vira o botão de contorno azul. Azul #0D65D9 sobre branco = 5,41:1.
  entrar:
    "inline-flex h-11 min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-full px-1 text-sm font-bold leading-none whitespace-nowrap text-[#0D65D9] min-[460px]:px-2 underline-offset-4 hover:underline motion-safe:transition-[color,background-color,border-color] motion-safe:duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C70F2] lg:border-2 lg:border-[#0C70F2] lg:bg-white lg:px-5 lg:font-semibold lg:text-[#0D65D9] lg:hover:bg-[#EEF5FF] lg:hover:no-underline",
  link: "inline-flex min-h-11 items-center rounded-full px-3 text-base font-medium text-[#0B1B3A] hover:bg-[#EEF5FF] hover:text-[#0D65D9] lg:text-[17px] motion-safe:transition-[color,background-color,border-color] motion-safe:duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C70F2]",
};
// Etiquetas das telas de exemplo (ocorrências, IA, alertas). Pares texto/fundo conferidos em LANDING_CONTRAST_PAIRS.
export const landingBadge = {
  error: "bg-[#FDE8E8] text-[#9B1C1C]",
  warning: "bg-[#FEF3C7] text-[#92400E]",
  ok: "bg-[#D7F6EA] text-[#0B5F3F]",
  info: "bg-[#DCEBFF] text-[#033473]",
};
