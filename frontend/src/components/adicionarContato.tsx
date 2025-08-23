import { useState, useRef } from "react";
import Button, { ButtonVariant } from "../components/button";

export default function AdicionarContatoButton({
  setModalAdicionarContato,
}: {
  setModalAdicionarContato: (valor: boolean) => void;
}) {
  const [mostrarTooltip, setMostrarTooltip] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const iniciarContagem = () => {
    // Se o mouse ficar 7 segundos, mostra o tooltip
    timeoutRef.current = window.setTimeout(() => {
      setMostrarTooltip(true);
    }, 7000);
  };

  const resetarContagem = () => {
    // Cancela o timer se sair antes de 7 segundos
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setMostrarTooltip(false);
  };

  return (
    <div className="relative">
      <Button
        label="+ Adicionar contato"
        variant={ButtonVariant.Secondary}
        onClick={() => setModalAdicionarContato(true)}
        onMouseEnter={iniciarContagem}
        onMouseLeave={resetarContagem}
      />

      {mostrarTooltip && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-[var(--background-secondary)] text-[var(--body)] text-sm px-3 py-1 rounded shadow-lg whitespace-nowrap z-50">
          Tá esperando o quê? Boraa moeer!! 🚀
        </div>
      )}
    </div>
  );
}
