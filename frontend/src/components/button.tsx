import { type ButtonHTMLAttributes } from "react";

export enum ButtonVariant {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: ButtonVariant;
  icon?: string;
  disabled?: boolean;
}

export default function Button({
  label,
  variant = ButtonVariant.Primary,
  icon,
  onClick,
  disabled = false, // valor padrão
  ...props
}: ButtonProps) {
  const baseClasses = `${
    disabled ? "cursor-not-allowed" : "cursor-pointer"
  } px-4 py-2 rounded-2xl font-medium transition-colors duration-200 z-10 flex items-center justify-center gap-2`;

  let variantClasses = "";

  if (variant === ButtonVariant.Primary) {
    variantClasses =
      "bg-[var(--brand)] text-[var(--inverse)] hover:bg-[var(--brand)]";
  }

  if (variant === ButtonVariant.Secondary) {
    variantClasses =
      "h-[3rem] bg-[var(--background-tertiary)] text-[var(--primary)] hover:bg-[var(--background-secondary)]";
  }

  if (variant === ButtonVariant.Tertiary) {
    variantClasses =
      "border border-[var(--border-primary)] bg-transparent text-[var(--primary)] hover:bg-[var(--background-tertiary)]";
  }

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed hover:bg-none"
    : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
      {...props}>
      {icon ? (
        <img src={icon} className="w-[1rem] h-[1rem] flex-shrink-0" />
      ) : null}
      {label}
    </button>
  );
}
