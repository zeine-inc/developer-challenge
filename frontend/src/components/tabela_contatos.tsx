import Button, { ButtonVariant } from "../components/button";
import IconButton from "../components/iconbutton";

import type { Contato } from "../interfaces/interfaces";

import CadeadoAberto from "../../public/icons/lock_open.png";
import Lixeira from "../../public/icons/remove.png";

interface TabelaContatosProps {
  onEditar: (contato: Contato) => void;
}

export default function TabelaContatos({ onEditar }: TabelaContatosProps) {
  const contatosSession = sessionStorage.getItem("contatos");
  const contatos: Contato[] = contatosSession
    ? JSON.parse(contatosSession)
    : [];

  if (contatos.length === 0) {
    return (
      <div className="text-center text-[var(--muted)] text-[1rem] py-10">
        Cadastre seu primeiro contato 🙂
      </div>
    );
  }

  return (
    <table className="w-full ml-8 border-separate border-spacing-0">
      <thead>
        <tr className="text-left">
          <th className="text-[var(--muted)] text-[0.75rem] font-bold w-[40%] pb-4">
            NOME
          </th>
          <th className="text-[var(--muted)] text-[0.75rem] font-bold w-[20%] pb-4">
            TELEFONE
          </th>
          <th className="text-[var(--muted)] text-[0.75rem] font-bold w-[25%] pb-4">
            EMAIL
          </th>
          <th className="w-[15%] pb-4"></th>
        </tr>
      </thead>

      <tbody>
        {contatos.map((contato, idx) => (
          <>
            <tr key={idx} className="align-middle">
              {/* Nome + Imagem */}
              <td className="py-8">
                <div className="flex items-center gap-3">
                  <img
                    src={contato.foto}
                    className="w-[3rem] h-[3rem] rounded-xl"
                  />
                  <div>
                    <p className="text-[var(--body)] text-[0.875rem] font-medium">
                      {contato.nome}
                    </p>
                    <p className="text-[var(--muted)] text-[0.75rem]">
                      {contato.relacao}
                    </p>
                  </div>
                </div>
              </td>

              {/* Telefone */}
              <td className="text-[var(--body)] text-[0.875rem] py-4">
                {contato.telefone.replace(/\d/g, "*")}
              </td>

              {/* Email */}
              <td className="text-[var(--body)] text-[0.875rem] py-4">
                {contato.email.replace(/./g, "*")}
              </td>

              {/* Ações */}
              <td className="py-4">
                <div className="flex gap-2">
                  <Button
                    label="Editar"
                    variant={ButtonVariant.Secondary}
                    onClick={() => onEditar(contato)}
                  />
                  <IconButton
                    imagem={CadeadoAberto}
                    ativo={false}
                    onClick={() => {}}
                  />
                  <IconButton
                    imagem={Lixeira}
                    ativo={false}
                    onClick={() => {}}
                  />
                </div>
              </td>
            </tr>

            {/* Linha separadora */}
            {idx < contatos.length - 1 && (
              <tr>
                <td colSpan={4} className="px-2">
                  <hr className="h-px w-[98%] bg-[var(--muted)] border-0" />
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </table>
  );
}
