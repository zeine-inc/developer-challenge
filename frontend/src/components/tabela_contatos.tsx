import { useState } from "react";
import Button, { ButtonVariant } from "../components/button";
import IconButton from "../components/iconbutton";
import ModalInformacoes from "./modalInformacoes";
import { excluirContato } from "../service/service";

import type { Contato } from "../interfaces/interfaces";

import CadeadoFechado from "../../public/icons/lock.png";
import CadeadoAberto from "../../public/icons/lock_open.png";
import Lixeira from "../../public/icons/remove.png";

interface TabelaContatosProps {
  onEditar: (contato: Contato) => void;
  desbloquearTodos: boolean;
  filtrar: string;
}

export default function TabelaContatos({
  onEditar,
  desbloquearTodos,
  filtrar,
}: TabelaContatosProps) {
  const contatosSession = sessionStorage.getItem("contatos");
  const contatos: Contato[] = contatosSession
    ? JSON.parse(contatosSession)
    : [];

  const [modalAberto, setModalAberto] = useState(false);
  const [contatoAtualIdx, setContatoAtualIdx] = useState<number | null>(null);
  const [desbloqueados, setDesbloqueados] = useState<number[]>([]);

  const contatosFiltrados = contatos
    .filter((c) =>
      filtrar ? c.nome.toUpperCase().startsWith(filtrar.toUpperCase()) : true
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  if (contatosFiltrados.length === 0) {
    return (
      <div className="text-center text-[var(--muted)] text-[1rem] py-10">
        Nenhum contato encontrado 🙂
      </div>
    );
  }
  const abrirModalOuBloquear = (idx: number) => {
    if (desbloqueados.includes(idx)) {
      setDesbloqueados((prev) => prev.filter((i) => i !== idx));
    } else {
      setContatoAtualIdx(idx);
      setModalAberto(true);
    }
  };

  const confirmarSenha = (senhaDigitada: string) => {
    const senhaSalva = sessionStorage.getItem("senha");
    if (senhaDigitada === senhaSalva && contatoAtualIdx !== null) {
      setDesbloqueados((prev) => [...prev, contatoAtualIdx]);
      setModalAberto(false);
    }
  };

  const removerContato = async (contatoId: number) => {
    const vendedorId = sessionStorage.getItem("id")!;
    const status = await excluirContato(vendedorId, contatoId);

    if (status === 200) {
      // Atualiza sessionStorage
      const contatosSession = sessionStorage.getItem("contatos");
      if (contatosSession) {
        const contatos: Contato[] = JSON.parse(contatosSession);
        const novosContatos = contatos.filter((c) => c.id !== contatoId);
        sessionStorage.setItem("contatos", JSON.stringify(novosContatos));
      }

      // Re-render
      setDesbloqueados((prev) =>
        prev.filter((_, idx) => contatosFiltrados[idx]?.id !== contatoId)
      );
    } else {
      console.error("Erro ao excluir contato");
    }
  };

  if (contatos.length === 0) {
    return (
      <div className="text-center text-[var(--muted)] text-[1rem] py-10">
        Cadastre seu primeiro contato 🙂
      </div>
    );
  }

  return (
    <>
      <table className="w-full ml-8 border-separate border-spacing-0 overflow-x-hidden overflow-y-scroll">
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
          {contatosFiltrados.map((contato, idx) => {
            const desbloqueado =
              desbloqueados.includes(idx) || desbloquearTodos;

            return (
              <tr key={idx} className="align-middle">
                {/* Nome + Imagem */}
                <td className="py-8">
                  <div className="flex items-center gap-3">
                    <img
                      src={contato.foto as string}
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
                  {desbloqueado
                    ? contato.telefone
                    : "*".repeat(contato.telefone.length)}
                </td>

                {/* Email */}
                <td className="text-[var(--body)] text-[0.875rem] py-4">
                  {desbloqueado
                    ? contato.email
                    : "*".repeat(contato.email.length)}
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
                      imagem={desbloqueado ? CadeadoAberto : CadeadoFechado}
                      ativo={false}
                      onClick={() => abrirModalOuBloquear(idx)}
                    />
                    <IconButton
                      imagem={Lixeira}
                      ativo={false}
                      onClick={() => removerContato(contato.id)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modalAberto && (
        <ModalInformacoes
          onClose={() => setModalAberto(false)}
          onConfirm={confirmarSenha}
        />
      )}
    </>
  );
}
