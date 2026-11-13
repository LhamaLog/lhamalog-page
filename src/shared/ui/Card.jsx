export function Card({ children, className = "", ...props }) {
  return (
    <div {...props} className={`rounded-xl border border-slate-200 bg-white p-4 ${className}`}>
      {children}
    </div>
  );
}
