import { useState } from "react";
import { EmptyState } from "../../../../shared/ui/EmptyState";
import { ErrorState } from "../../../../shared/ui/ErrorState";
import { LoadingState } from "../../../../shared/ui/LoadingState";
import { PeriodSelector } from "../shared/PeriodSelector";
import { PublicPlanCard } from "./PublicPlanCard";
// Plano em destaque: o André decidiu manter o Pro (05/11); o PO confirma depois. O Core ainda não manda esta informação.
const RECOMMENDED_PLAN = "PRO";
// Seletor de periodicidade, estados (carregando, erro, vazio) e grade de planos da página pública (/planos) e da landing.
// Só a periodicidade é escolhida aqui; a forma de pagamento é escolhida ao contratar. Devolve um Fragment para os filhos
// continuarem filhos diretos do layout da página (mesmo espaçamento de antes).
export function PlansCatalog({ state, onSubscribe, initialPeriod = "MENSAL", header, notice }) {
  const { data, error, loading, reload } = state;
  const [period, setPeriod] = useState(initialPeriod);
  return (
    <>
      <div className="space-y-5 text-center">
        {header}
        <PeriodSelector value={period} onChange={setPeriod} hideLegend center size="lg" />
      </div>

      {notice}

      {loading && <LoadingState label="Carregando os planos..." rows={4} />}

      {!loading && error && (
        <ErrorState title="Falha ao carregar os planos" description={error} onRetry={reload} />
      )}

      {!loading && !error && data && data.planos.length === 0 && (
        <EmptyState title="Não há planos disponíveis no momento" description="Volte mais tarde." />
      )}

      {!loading && !error && data && data.planos.length > 0 && (
        // 5 colunas só em tela muito larga; cada cartão ocupa 6 linhas da grade (subgrade), por isso ficam alinhados.
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 pt-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {data.planos.map((plan, index) => (
            <PublicPlanCard
              key={plan.codigo}
              plan={plan}
              previous={index > 0 ? data.planos[index - 1] : null}
              period={period}
              recommended={plan.codigo === RECOMMENDED_PLAN}
              onSubscribe={(selected) => onSubscribe(selected, period)}
            />
          ))}
        </div>
      )}
    </>
  );
}
