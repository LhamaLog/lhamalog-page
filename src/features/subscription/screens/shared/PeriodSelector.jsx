import { BILLING_PERIODS } from "../../format";
import { OptionSelector } from "./OptionSelector";
export function PeriodSelector({
  value,
  onChange,
  hideLegend = false,
  center = false,
  size = "md",
  variant = "default",
  hints,
}) {
  return (
    <OptionSelector
      legend="Periodicidade"
      options={BILLING_PERIODS}
      value={value}
      onChange={onChange}
      hideLegend={hideLegend}
      center={center}
      size={size}
      variant={variant}
      hints={hints}
    />
  );
}
