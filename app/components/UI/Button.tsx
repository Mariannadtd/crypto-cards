import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">;

export default function Button({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseClassName =
    "rounded border border-zinc-800 bg-zinc-900 px-4 py-2 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <button type={type} className={`${baseClassName} ${className}`} {...props}>
      {children}
    </button>
  );
}
