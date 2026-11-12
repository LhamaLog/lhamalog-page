import { useId, useRef, useState } from "react";
import { signInUrl, signUpUrl } from "../../../shared/appLinks";
import logo from "../../../shared/assets/lhamalog-logo.svg";
import symbol from "../../../shared/assets/lhamalog-symbol.svg";
import { NAV_ACTIONS, NAV_LINKS, SUPPORT_TEXTS } from "../content";
import { landingNav } from "../landingTokens";
// Barra flutuante e arredondada (FR-001). Em tela larga: logo, 4 links âncora, "Entrar" e "Começar grátis".
// Abaixo de 1024 px (o 768 px da spec subiu porque os links maiores não cabem em uma linha antes disso): logo, "Entrar" (link compacto),
// "Começar grátis" e um botão de menu só com os 4 links. O "Entrar" é um único elemento na barra, nunca repetido no menu.
// O menu abre e fecha pelo botão, fecha com Esc (devolvendo o foco ao botão) e ao escolher um link.
export function FloatingNav() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef(null);
  const close = () => setOpen(false);
  const onKeyDown = (event) => {
    if (event.key === "Escape" && open) {
      close();
      buttonRef.current?.focus();
    }
  };
  return (
    <header
      onKeyDown={onKeyDown}
      className="fixed inset-x-0 top-3 z-50 px-2 min-[460px]:px-3 sm:top-4 sm:px-4"
    >
      <div className="relative mx-auto max-w-[1100px]">
        <nav
          aria-label={SUPPORT_TEXTS.navegacaoPrincipal}
          className="flex h-16 items-center justify-between gap-2 rounded-full border border-[#D2E1F6] bg-white/95 pl-3 pr-1.5 shadow-[0_8px_24px_-12px_rgba(8,59,122,0.35)] backdrop-blur min-[460px]:pl-4 min-[460px]:pr-2.5 sm:pl-6 sm:pr-3"
        >
          {/* Abaixo de 460 px o logo largo não cabe ao lado de "Entrar", "Começar grátis" e do menu: entra só o símbolo da marca. */}
          {/* Área de toque de pelo menos 44 x 44 px. O símbolo (24 px de largura) estende a área para os lados com margem negativa,
            para não ocupar mais espaço na barra estreita. */}
          <a
            href="/"
            className="-mx-2.5 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C70F2] min-[460px]:mx-0"
          >
            <img src={symbol} alt="LhamaLog" className="h-8 w-auto min-[460px]:hidden" />
            <img src={logo} alt="LhamaLog" className="hidden h-8 w-auto min-[460px]:block sm:h-9" />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className={landingNav.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-1 min-[460px]:gap-1.5 sm:gap-2">
            <a href={signInUrl()} className={landingNav.entrar}>
              {NAV_ACTIONS.entrar}
            </a>
            <a href={signUpUrl()} className={landingNav.primary}>
              {NAV_ACTIONS.comecarGratis}
            </a>
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? SUPPORT_TEXTS.fecharMenu : SUPPORT_TEXTS.abrirMenu}
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[#033473] hover:bg-[#EEF5FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C70F2] lg:hidden"
            >
              <svg
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </nav>

        <div
          id={menuId}
          hidden={!open}
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-3xl border border-[#D2E1F6] bg-white p-3 shadow-[0_16px_32px_-16px_rgba(8,59,122,0.4)] lg:hidden"
        >
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} onClick={close} className={`${landingNav.link} w-full`}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
