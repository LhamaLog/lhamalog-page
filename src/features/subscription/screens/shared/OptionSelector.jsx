import { useId } from "react";
// Grupo de opções (radio nativo, navegável por teclado e lido pelo leitor de tela) com visual de botões.
export function OptionSelector({
  legend,
  options,
  value,
  onChange,
  hideLegend = false,
  center = false,
  size = "md",
  variant = "default",
  hints,
}) {
  const name = useId();
  const segmented = variant === "segmented";
  return (
    <fieldset className={`min-w-0 ${segmented ? "w-full" : ""}`}>
      <legend className={hideLegend ? "sr-only" : "mb-2 text-sm font-semibold text-[#033473]"}>
        {legend}
      </legend>
      <div
        className={
          segmented
            ? `grid w-full max-w-3xl grid-cols-3 gap-1 rounded-2xl border border-[#D2E1F6] bg-white p-1 shadow-[0_10px_24px_-18px_rgba(8,59,122,0.55)] ${center ? "mx-auto" : ""}`
            : `flex flex-wrap ${size === "lg" ? "gap-2.5 sm:gap-3" : "gap-2"} ${center ? "justify-center" : ""}`
        }
      >
        {options.map((option) => {
          const hint = hints?.[option.value];
          return (
            <label
              key={option.value}
              className={
                segmented
                  ? "flex min-h-12 min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-center text-sm font-semibold leading-tight text-[#141826] hover:bg-[#EEF5FF] motion-safe:transition-colors motion-safe:duration-150 has-[:checked]:bg-[#0D65D9] has-[:checked]:text-white has-[:checked]:hover:bg-[#0B57BD] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#0C70F2] sm:px-3 sm:text-base"
                  : `inline-flex ${size === "lg" ? "min-h-12 px-3.5 text-base sm:min-h-[52px] sm:px-7 sm:text-lg" : "min-h-11 px-4 text-[15px] sm:px-5"} cursor-pointer items-center rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 hover:border-[#0C70F2] hover:bg-[#EEF5FF] hover:text-[#0D65D9] motion-safe:transition-colors motion-safe:duration-150 has-[:checked]:border-[#0C70F2] has-[:checked]:bg-[#0C70F2] has-[:checked]:text-white has-[:checked]:hover:bg-[#0B57BD] has-[:checked]:hover:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#0C70F2]`
              }
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span>{option.label}</span>
              {hint ? (
                <span className="max-w-full text-balance rounded-full bg-[#D7F6EA] px-2 py-1 text-sm font-semibold leading-tight text-[#0B5F3F]">
                  {hint}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
