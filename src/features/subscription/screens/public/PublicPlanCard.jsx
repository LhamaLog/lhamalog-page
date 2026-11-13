import { signUpUrl } from "../../../../shared/appLinks";
import { formatBRL, periodSuffix, planItems, planPrice } from "../../format";
import { isTrialAvailable } from "../../subscriptionRules";
import { publicButton, publicCard } from "./publicPlansTokens";
const DESCRIPTIONS = {
  FREE: "Para conhecer o LhamaLog",
  STARTER: "Para um time pequeno com poucos produtos",
  PRO: "Para times que dependem dos logs todo dia",
  BUSINESS: "Para empresas com vários produtos",
  ENTERPRISE: "Para operações grandes e personalizadas",
};
// Preço em partes: "R$" pequeno, inteiro grande, centavos menores. Só separa o texto já formatado (sem cálculo);
// o período fica numa linha própria, para nenhum valor (nem R$ 16.141,99) quebrar.
function PriceText({ cents, className }) {
  const text = formatBRL(cents);
  const match = text.match(/^(\D+?)\s*([\d.]+),(\d{2})$/);
  if (!match)
    return <span className={`text-[38px] font-bold leading-none ${className}`}>{text}</span>;
  return (
    <span
      aria-label={text}
      className={`flex items-baseline whitespace-nowrap tabular-nums ${className}`}
    >
      <span aria-hidden="true" className="mr-1 text-base font-semibold">
        {match[1]}
      </span>
      <span aria-hidden="true" className="text-[38px] font-bold leading-none tracking-[-0.02em]">
        {match[2]}
      </span>
      <span aria-hidden="true" className="text-xl font-bold leading-none">
        ,{match[3]}
      </span>
    </span>
  );
}
// Cartão de plano da página pública. Cinco linhas alinhadas entre todos os cartões (grade com subgrade):
// cabeçalho, preço, botão, selo do teste, lista e nota. O recomendado (Pro) fica em azul escuro da marca (#033473).
// O preço mostrado é o do Pix (o boleto custa o mesmo); cartão e débito custam um pouco mais e a pessoa escolhe ao contratar.
export function PublicPlanCard({ plan, previous, period, recommended, onSubscribe }) {
  const price = planPrice(plan, period, "PIX");
  const overage = plan.precoGbExcedenteCentavos?.PIX;
  const free = price === null;
  // Selo do teste só quando ele vale (Starter ou Pro, mensal, cartão): FR-022, T029.
  const trial = isTrialAvailable(plan, period, "CARTAO");
  const { title, items } = planItems(plan, previous, period);
  const titleId = `plano-${plan.codigo}`;
  const theme = recommended ? publicCard.featured : publicCard.plain;
  return (
    <section aria-labelledby={titleId} className={`${publicCard.base} ${theme.surface}`}>
      {recommended && (
        <span className="absolute -top-3.5 left-6 rounded-full bg-[#0C70F2] px-3.5 py-1.5 text-sm font-semibold leading-none text-white shadow-[0_2px_6px_rgba(12,112,242,0.45)] ring-4 ring-white 2xl:left-7">
          Recomendado
        </span>
      )}

      <div className="space-y-2 pb-5">
        <div className="flex items-center justify-between gap-2">
          <h2
            id={titleId}
            className={`text-[22px] font-bold leading-tight tracking-[-0.01em] ${theme.name}`}
          >
            {plan.nome}
          </h2>
          {plan.atual && (
            <span className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-[#033473]">
              Seu plano
            </span>
          )}
        </div>
        <p className={`text-[15px] leading-snug ${theme.text}`}>
          {DESCRIPTIONS[plan.codigo] ?? ""}
        </p>
      </div>

      <div className={`border-t pt-5 ${theme.divider}`}>
        {free ? (
          <span className={`block text-[38px] font-bold leading-none ${theme.price}`}>Grátis</span>
        ) : (
          <PriceText cents={price} className={theme.price} />
        )}
        <span className={`mt-2 block text-sm leading-snug ${theme.muted}`}>
          {free ? "sem cartão" : periodSuffix(period)}
        </span>
      </div>

      <div className="pt-4">
        {free ? (
          <a href={signUpUrl()} className={publicButton.outline}>
            Começar grátis
          </a>
        ) : (
          <button
            type="button"
            disabled={plan.atual}
            onClick={() => onSubscribe(plan)}
            aria-label={plan.atual ? `${plan.nome}, plano atual` : `Contratar ${plan.nome}`}
            className={recommended ? publicButton.onDark : publicButton.primary}
          >
            {plan.atual ? "Plano atual" : "Contratar"}
          </button>
        )}
      </div>

      {/* Linha reservada para o selo do teste (só quando há colunas lado a lado): as listas começam na mesma altura em todos os cartões. */}
      <div className={`${trial ? "flex" : "hidden sm:flex"} items-center pt-3 sm:min-h-10`}>
        {trial && (
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${theme.trial}`}>
            Teste grátis de {plan.testeGratisDias} dias
          </span>
        )}
      </div>

      <div className={`mt-2 border-t pt-5 ${theme.divider}`}>
        <p className={`mb-3.5 text-sm font-semibold ${theme.muted}`}>{title}</p>
        <ul className={`space-y-3 text-[15px] font-medium leading-snug ${theme.item}`}>
          {items.map((item) => (
            <li key={item} className="grid grid-cols-[1.5rem_1fr] items-start gap-2.5">
              <span
                aria-hidden="true"
                className={`mt-px flex h-6 w-6 items-center justify-center rounded-full text-[13px] font-bold ${theme.check}`}
              >
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className={`mt-6 border-t pt-4 text-sm leading-snug ${theme.muted} ${theme.divider}`}>
        {overage == null
          ? "Ao chegar na franquia, a ingestão pausa."
          : `GB a mais: ${formatBRL(overage)} por GB`}
      </p>
    </section>
  );
}
