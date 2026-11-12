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
}) {
  const name = useId();
  return (
    <fieldset className="min-w-0">
      <legend className={hideLegend ? "sr-only" : "mb-2 text-sm font-semibold text-[#033473]"}>
        {legend}
      </legend>
      <div
        className={`flex flex-wrap ${size === "lg" ? "gap-2.5 sm:gap-3" : "gap-2"} ${center ? "justify-center" : ""}`}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`inline-flex ${size === "lg" ? "min-h-12 px-3.5 text-base sm:min-h-[52px] sm:px-7 sm:text-lg" : "min-h-11 px-4 text-[15px] sm:px-5"} cursor-pointer items-center rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 hover:border-[#0C70F2] hover:bg-[#EEF5FF] hover:text-[#0D65D9] motion-safe:transition-colors motion-safe:duration-150 has-[:checked]:border-[#0C70F2] has-[:checked]:bg-[#0C70F2] has-[:checked]:text-white has-[:checked]:hover:bg-[#0B57BD] has-[:checked]:hover:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#0C70F2]`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
