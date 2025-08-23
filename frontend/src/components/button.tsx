import { type ButtonHTMLAttributes } from "react";

export enum ButtonVariant {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: ButtonVariant;
}

export default function Button({
  label,
  variant = ButtonVariant.Primary,
  onClick,
  ...props
}: ButtonProps) {
  const baseClasses =
    "cursor-pointer px-4 py-2 rounded-2xl font-medium transition-colors duration-200 z-10";

  let variantClasses = "";

  if (variant === ButtonVariant.Primary) {
    variantClasses =
      "bg-[var(--brand)] text-[var(--inverse)] hover:bg-[var(--brand)]";
  }

  if (variant === ButtonVariant.Secondary) {
    variantClasses =
      "bg-[var(--background-tertiary)] text-[var(--primary)] hover:bg-[var(--background-secondary)]";
  }

  if (variant === ButtonVariant.Tertiary) {
    variantClasses =
      "border border-[var(--border-primary)] bg-transparent text-[var(--primary)] hover:bg-[var(--background-tertiary)]";
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
      {...props}>
      {label}
    </button>
  );
}
