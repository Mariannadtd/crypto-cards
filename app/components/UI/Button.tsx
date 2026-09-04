import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">;

export default function Button({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseClassName =
    "inline-flex min-h-10 items-center justify-center rounded-md border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-50 shadow-sm shadow-emerald-950/30 transition hover:border-emerald-200/60 hover:bg-emerald-300/20 disabled:cursor-not-allowed disabled:border-stone-700 disabled:bg-stone-800/70 disabled:text-stone-500 disabled:shadow-none";

  return (
    <button type={type} className={`${baseClassName} ${className}`} {...props}>
      {children}
    </button>
  );
}
