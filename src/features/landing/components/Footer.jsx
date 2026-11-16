// Logo para fundo escuro: a mesma marca, sem o retângulo branco, com o texto em branco e o tom escuro do símbolo
// clareado (#9CC2F9) para aparecer sobre #141826.
import logo from "../../../shared/assets/lhamalog-logo-escuro.svg";
import { FOOTER } from "../content";
import { LEGAL_LINKS } from "../legalLinks";
import { landingSection } from "../landingTokens";
// Rodapé (FR-009, FR-027): fundo #141826, logo, "©" e Termos de Uso e Política de Privacidade. Sem ícones de redes sociais (removidos
// em 2026-11-14 a pedido da revisão do JP). Termos e Política sem endereço aparecem como texto simples (sem link e sem aviso); com
// endereço (legalLinks.js), viram link que abre em outra aba, sem mudar o layout. Textos em #CBD5E1 sobre #141826 (11,9:1).
function LegalItem({ label, href }) {
  if (href === null) {
    return <span className="inline-flex min-h-11 items-center text-[#CBD5E1]">{label}</span>;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center rounded-lg font-medium text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {label}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#141826] pb-8 pt-4 text-base text-[#CBD5E1]">
      <div className={landingSection.container}>
        <img src={logo} alt="LhamaLog" className="h-11 w-auto sm:h-12" />
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p>{FOOTER.direitos}</p>
          <nav aria-label={`${FOOTER.termos} e ${FOOTER.politica}`}>
            <ul className="flex flex-col items-center gap-x-8 sm:flex-row">
              <li>
                <LegalItem label={FOOTER.termos} href={LEGAL_LINKS.termos} />
              </li>
              <li>
                <LegalItem label={FOOTER.politica} href={LEGAL_LINKS.politica} />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
