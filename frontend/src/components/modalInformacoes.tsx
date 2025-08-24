import { useState } from "react";
import Fechar from "../../public/icons/cancel.png";
import TextField from "./text_field";
import Button, { ButtonVariant } from "./button";

interface ModalProps {
  onClose: () => void;
  onConfirm: (senhaDigitada: string) => void;
}

export default function ModalInformacoes({ onClose, onConfirm }: ModalProps) {
  const [senha, setSenha] = useState<string>("");

  return (
    <section
      aria-label="Janela flutuante"
      className="absolute inset-0 flex justify-center items-center backdrop-blur-md z-20">
      <div className="bg-[var(--background-primary)] p-6 rounded-2xl w-[21rem] h-[19rem] relative">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-lg font-bold">
            Visualizar Informações
          </h2>
          <img
            src={Fechar}
            className="w-5 h-5 cursor-pointer"
            onClick={onClose}
          />
        </div>

        <hr className="h-px w-[90%] my-3 bg-white" />

        <div className="p-[1rem]">
          <TextField
            input={senha}
            onChange={setSenha}
            label="Senha"
            placeholder="Digite sua senha"
            type="password"
          />
        </div>

        <hr className="h-px w-[90%] my-3 bg-[var(--muted)]" />

        <div className="flex gap-2 justify-end mt-[2rem]">
          <Button
            label="Voltar"
            variant={ButtonVariant.Secondary}
            onClick={onClose}
          />
          <Button
            label="Confirmar"
            variant={ButtonVariant.Primary}
            onClick={() => onConfirm(senha)}
          />
        </div>
      </div>
    </section>
  );
}
