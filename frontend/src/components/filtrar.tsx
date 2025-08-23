import { useState } from "react";

interface FiltroAlfabetoProps {
  letras?: string[];
  onSelecionar: (letra: string) => void;
}

export default function FiltroAlfabeto({
  letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  onSelecionar,
}: FiltroAlfabetoProps) {
  const [selecionada, setSelecionada] = useState<string | null>(null);

  const selecionar = (letra: string) => {
    if (selecionada === letra) {
      onSelecionar("");
      setSelecionada(null);
    } else {
      onSelecionar(letra);
      setSelecionada(letra);
    }
  };

  return (
    <div
      className="flex lg:flex-col bg-[var(--brand)] rounded-[1.5rem] mt-[1rem] px-2 py-4 gap-2 items-center select-none
               md:justify-around md:w-full lg:w-[4rem] 
               max-h-[60vh] overflow-y-auto scrollbar-none">
      {letras.map((letra) => {
        const isSelecionada = letra === selecionada;
        return (
          <button
            key={letra}
            onClick={() => selecionar(letra)}
            className={`cursor-pointer font-bold transition-all ${
              isSelecionada
                ? "text-[1.5rem] text-[var(--inverse)]"
                : "text-[1.2rem] text-[var(--muted)] hover:scale-150 hover:text-[var(--inverse)]"
            }`}>
            {letra}
          </button>
        );
      })}
    </div>
  );
}
