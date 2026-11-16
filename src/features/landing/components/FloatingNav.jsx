import { useId, useRef, useState } from "react";
import { signInUrl, signUpUrl } from "../../../shared/appLinks";
import mark from "../../../shared/assets/lhamalog-mark.png";
import wordmark from "../../../shared/assets/lhamalog-wordmark.png";
import { NAV_ACTIONS, NAV_LINKS, SUPPORT_TEXTS } from "../content";
import { landingNav } from "../landingTokens";
// Barra flutuante e arredondada (FR-001). De 1024 px em diante: logo, 4 links âncora, "Acessar Página" e "Começar grátis".
// Abaixo disso os links vão para o menu. As duas ações continuam na barra. Em tela estreita a barra quebra em duas linhas
// (logo e menu; depois as duas ações) para nada sair da tela.
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
    <header onKeyDown={onKeyDown} className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
      <div className="relative mx-auto w-full max-w-[1100px]">
        <nav
          aria-label={SUPPORT_TEXTS.navegacaoPrincipal}
          className="rounded-3xl border border-[#D2E1F6] bg-white/95 px-3 py-2 shadow-[0_8px_24px_-12px_rgba(8,59,122,0.35)] backdrop-blur sm:rounded-full sm:px-4 sm:py-0"
        >
          <div className="flex items-center gap-2 sm:h-16">
            <a
              href="/"
              className="inline-flex min-h-11 shrink-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C70F2]"
            >
              <img src={mark} alt="LhamaLog" width={273} height={360} className="h-8 w-auto sm:hidden" />
              <img
                src={wordmark}
                alt="LhamaLog"
                width={762}
                height={180}
                className="hidden h-8 w-auto sm:block sm:h-9"
              />
            </a>

            <ul className="hidden items-center gap-1 lg:flex lg:flex-1 lg:justify-center">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className={landingNav.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="ml-auto hidden items-center gap-2 sm:flex">
              <a href={signInUrl()} className={landingNav.entrar}>
                {NAV_ACTIONS.entrar}
              </a>
              <a href={signUpUrl()} className={landingNav.primary}>
                {NAV_ACTIONS.comecarGratis}
              </a>
            </div>

            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? SUPPORT_TEXTS.fecharMenu : SUPPORT_TEXTS.abrirMenu}
              onClick={() => setOpen((value) => !value)}
              className="ml-auto inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#033473] hover:bg-[#EEF5FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C70F2] sm:ml-0 lg:hidden"
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

          <div className="mt-2 flex flex-wrap gap-2 sm:hidden">
            <a href={signInUrl()} className={`${landingNav.entrar} min-w-[8.5rem] flex-1`}>
              {NAV_ACTIONS.entrar}
            </a>
            <a href={signUpUrl()} className={`${landingNav.primary} min-w-[8.5rem] flex-1`}>
              {NAV_ACTIONS.comecarGratis}
            </a>
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
