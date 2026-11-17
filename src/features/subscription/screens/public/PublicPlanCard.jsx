import { signUpUrl } from "../../../../shared/appLinks";
import { formatBRL, periodSuffix, planItems, planPrice, semestralSavings } from "../../format";
import { publicButton, publicCard } from "./publicPlansTokens";
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
      <span aria-hidden="true" className="text-[34px] font-bold leading-none tracking-[-0.02em] sm:text-[38px]">
        {match[2]}
      </span>
      <span aria-hidden="true" className="text-xl font-bold leading-none">
        ,{match[3]}
      </span>
    </span>
  );
}
// Cartão de plano da página pública. Cinco linhas alinhadas entre todos os cartões (grade com subgrade):
// cabeçalho, preço, botão, lista e nota. O recomendado (Pro) fica em azul escuro da marca (#033473).
// O preço mostrado é o do Pix (o boleto custa o mesmo); cartão e débito custam um pouco mais e a pessoa escolhe ao contratar.
export function PublicPlanCard({ plan, previous, period, recommended, onSubscribe }) {
  const price = planPrice(plan, period, "PIX");
  const overage = plan.precoGbExcedenteCentavos?.PIX;
  const free = price === null;
  const { title, items } = planItems(plan, previous, period);
  const savings = period === "SEMESTRAL" ? semestralSavings(plan) : null;
  const titleId = `plano-${plan.codigo}`;
  const theme = recommended ? publicCard.featured : publicCard.plain;
  const badge = plan.selo || null;
  return (
    <section aria-labelledby={titleId} className={`${publicCard.base} ${theme.surface}`}>
      {recommended && (
        <span className="absolute -top-3.5 left-6 rounded-full bg-[#0D65D9] px-3.5 py-1.5 text-sm font-semibold leading-none text-white shadow-[0_8px_16px_-8px_rgba(13,101,217,0.8)] ring-4 ring-[#F2F2F2] 2xl:left-7">
          Recomendado
        </span>
      )}

      <div className="space-y-2 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            id={titleId}
            className={`text-[22px] font-bold leading-tight tracking-[-0.01em] ${theme.name}`}
          >
            {plan.nome}
          </h2>
          {plan.atual ? (
            <span className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-[#033473]">
              Seu plano
            </span>
          ) : (
            badge && (
              <span className={`rounded-full px-2.5 py-1 text-sm font-semibold leading-none ${theme.chip}`}>
                {badge}
              </span>
            )
          )}
        </div>
        <p className={`text-[15px] leading-snug ${theme.text}`}>
          {plan.descricao}
        </p>
      </div>

      <div className={`border-t pt-5 ${theme.divider}`}>
        {savings && (
          <p className={`mb-2 flex flex-wrap items-center gap-2 text-sm ${theme.muted}`}>
            <span className="line-through">De {formatBRL(savings.full)}</span>
            {savings.percent >= 1 && (
              <span className="rounded-full bg-[#D7F6EA] px-2 py-1 text-sm font-semibold leading-none text-[#0B5F3F]">
                −{savings.percent}%
              </span>
            )}
          </p>
        )}
        {free ? (
          <span className={`block text-[34px] font-bold leading-none sm:text-[38px] ${theme.price}`}>
            Grátis
          </span>
        ) : (
          <PriceText cents={price} className={theme.price} />
        )}
        <span className={`mt-2 block text-sm leading-snug ${theme.muted}`}>
          {free ? "sem cartão" : periodSuffix(period)}
        </span>
        {savings && (
          <p className={`mt-2 text-sm font-semibold leading-snug ${theme.savings}`}>
            Você economiza {formatBRL(savings.saved)} em relação a 6 mensalidades
          </p>
        )}
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

      <div className={`mt-5 border-t pt-5 ${theme.divider}`}>
        <p className={`mb-3.5 text-sm font-semibold ${theme.muted}`}>{title}</p>
        <ul className={`space-y-3 text-[15px] font-medium leading-snug ${theme.item}`}>
          {items.map((item) => (
            <li key={item} className="grid grid-cols-[1.5rem_1fr] items-start gap-2.5">
              <span
                aria-hidden="true"
                className={`mt-px flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${theme.check}`}
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
