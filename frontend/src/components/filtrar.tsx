import { useState } from "react";

interface FiltroAlfabetoProps {
  letras?: string[];
  onSelecionar: (letra: string) => void;
}

export default function FiltroAlfabeto({
  letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  onSelecionar,
}: FiltroAlfabetoProps) {
  const [ativo, setAtivo] = useState<string | null>(null);

  const selecionar = (letra: string) => {
    console.log(`Letra selecionar ${letra}`);
  };

  return (
    <div className="flex flex-col bg-[var(--brand)] rounded-[1.5rem] mt-[1rem] px-2 py-4 gap-2 items-center select-none w-[4rem]">
      {letras.map((letra) => (
        <button
          key={letra}
          onClick={() => selecionar(letra)}
          className={`cursor-pointer text-[1.2rem] font-bold transition-colors text-[var(--muted)] hover:scale-150 hover:text-[var(--inverse)]`}>
          {letra}
        </button>
      ))}
    </div>
  );
}
