import { Fragment } from "react";
import { OTLP_EXAMPLE_LINES, SUPPORT_TEXTS } from "../content";
import { landingSection, landingText } from "../landingTokens";
// Texto comum de uma linha: depois de cada "=" fica uma oportunidade de quebra (<wbr>, que não entra no texto copiado). Em tela
// estreita a linha quebra ali, em vez de partir palavras no meio.
function Plain({ text }) {
  return (
    <>
      {text.split("=").map((piece, index) => (
        <Fragment key={index}>
          {index > 0 && <>={<wbr />}</>}
          {piece}
        </Fragment>
      ))}
    </>
  );
}
// Uma linha do exemplo OTLP, com o nome da variável e os marcadores a trocar (<...>) em cores próprias. O texto continua idêntico
// ao de `content.ts` (quem seleciona e copia leva a linha inteira); as cores só ajudam a ver o que precisa ser trocado.
function CodeLine({ line }) {
  const equals = line.indexOf("=");
  const name = equals === -1 ? line : line.slice(0, equals);
  const value = equals === -1 ? "" : line.slice(equals);
  return (
    <>
      <span className="text-[#9CC2F9]">{name}</span>
      {value.split(/(<[^>]+>)/).map((part, index) =>
        part.startsWith("<") ? (
          <span key={index} className="font-semibold text-[#8FF0C4]">
            {part}
          </span>
        ) : (
          <Plain key={index} text={part} />
        ),
      )}
      {"\n"}
    </>
  );
}
// Integração (FR-006): título e introdução aprovados e o exemplo OTLP, só com marcadores (nunca endereço ou token reais).
// Layout: título à esquerda e bloco de código largo logo abaixo, de propósito diferente dos blocos de recursos (texto + tela).
// O código quebra a linha dentro do bloco (sem rolagem lateral em 375 px), nos "=" e nos espaços, e continua selecionável; sem botão
// de copiar. Título, introdução e bloco ficam alinhados à esquerda do contêiner, na mesma borda dos títulos das outras seções.
export function IntegrationSection() {
  return (
    <section
      id="integracao"
      aria-labelledby="integracao-titulo"
      className={`${landingSection.anchor} ${landingSection.spacing} bg-white`}
    >
      <div className={landingSection.container}>
        <div>
          <h2 id="integracao-titulo" className={landingText.sectionTitle}>
            {SUPPORT_TEXTS.tituloIntegracao}
          </h2>
          <p className={`${landingText.sectionIntro} mt-4 max-w-2xl text-pretty`}>
            {SUPPORT_TEXTS.introIntegracao}
          </p>
          <pre className="mt-8 max-w-4xl overflow-hidden rounded-2xl bg-[#0B1B3A] p-5 text-sm leading-relaxed text-[#E2E8F0] shadow-[0_24px_48px_-24px_rgba(8,59,122,0.55)] sm:mt-10 sm:p-8 sm:text-base">
            <code className="block whitespace-pre-wrap break-words">
              {OTLP_EXAMPLE_LINES.map((line) => (
                <CodeLine key={line} line={line} />
              ))}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
