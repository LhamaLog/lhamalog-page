// Logo para fundo escuro: a mesma marca, sem o retângulo branco de fundo, com o texto em branco e o tom escuro do símbolo
// clareado (#9CC2F9) para aparecer sobre #141826.
import logo from "../../../shared/assets/lhamalog-logo-escuro.svg";
import { FOOTER } from "../content";
import { LEGAL_LINKS } from "../legalLinks";
import { SOCIAL_LINKS } from "../socialLinks";
import { landingSection } from "../landingTokens";
import { SocialIcon } from "./SocialIcons";
// Rodapé (FR-009, FR-027), no estilo de rodapé escuro de SaaS (referência: dash0.com, sem copiar textos nem marca).
// Fundo #141826; textos em #CBD5E1 (12,5:1) e branco; pares conferidos em landingTokens.js.
// Termos de Uso e Política de Privacidade: com o endereço nulo, aparecem como texto simples (sem link e sem aviso); com endereço,
// viram link que abre em outra aba, sem mudar o layout. As redes seguem a mesma regra (socialLinks.js): sem endereço, o ícone
// aparece sem link, com o nome da rede para leitor de tela.
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

const iconBox =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5";

function SocialItem({ rede, href }) {
  if (href === null) {
    return (
      <span role="img" aria-label={rede} title={rede} className={`${iconBox} text-[#CBD5E1]`}>
        <SocialIcon rede={rede} />
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={rede}
      title={rede}
      className={`${iconBox} text-white hover:border-white/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-safe:transition-colors motion-safe:duration-150`}
    >
      <SocialIcon rede={rede} />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#141826] pb-8 pt-4 text-base text-[#CBD5E1]">
      <div className={landingSection.container}>
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <img src={logo} alt="LhamaLog" className="h-11 w-auto sm:h-12" />
          <ul aria-label={FOOTER.redes} className="flex flex-wrap justify-center gap-3">
            {SOCIAL_LINKS.map((item) => (
              <li key={item.rede}>
                <SocialItem rede={item.rede} href={item.href} />
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
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
