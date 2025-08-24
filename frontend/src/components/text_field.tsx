import type { HTMLInputTypeAttribute } from "react";
import { useState } from "react";
import ErrorRed from "../../public/icons/error_red.png";

interface TextFieldProps {
  label: string;
  helper?: string;
  type: HTMLInputTypeAttribute;
  placeholder: string;
  error?: boolean;
  input: string;
  icon?: string; // caminho da imagem do ícone
  onChange: (value: string) => void;
}

export default function TextField({
  label,
  helper,
  type,
  placeholder,
  error = false,
  input,
  icon,
  onChange,
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Validação para gerar borda de erro
  const [touched, setTouched] = useState(false);

  const showError = touched && error;

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label */}
      {label && (
        <label className="font-semibold text-[var(--body)] text-[0.875rem] leading-[1.5rem]">
          {label}
        </label>
      )}

      {/* Input com ícone */}
      <div className="relative w-full">
        {icon && (
          <img
            src={icon}
            alt="ícone"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setTouched(true);
          }}
          onChange={(e) => onChange(e.target.value)}
          className={`rounded-xl w-full ${
            icon ? "pl-[2rem]" : "pl-[1rem]"
          } pr-3 py-3 
            bg-[var(--background-secondary)] text-[0.75rem] leading-[1.25rem]
            text-[var(--placeholder)] outline-none
            border 
            ${
              showError
                ? "border-[var(--red)]"
                : isFocused
                ? "border-[var(--brand)]"
                : "border-[var(--border-primary)] hover:border-[var(--placeholder)]"
            }`}
        />
      </div>

      {/* Helper */}
      {helper && (
        <small
          className={`flex items-center gap-1 text-[0.75rem] leading-[1.25rem] ${
            error ? "text-[var(--red)]" : "text-[var(--placeholder)]"
          }`}>
          <img src={ErrorRed} /> {helper}
        </small>
      )}
    </div>
  );
}
