import { useState } from "react";
import React from "react";

import Button, { ButtonVariant } from "../components/button";
import IconButton from "../components/iconbutton";
import ModalInformacoes from "./modalInformacoes";
import ModalContato from "./modalContato";

import type { Contato } from "../interfaces/interfaces";

import { excluirContato } from "../service/service";

import CadeadoFechado from "../../public/icons/lock.png";
import CadeadoAberto from "../../public/icons/lock_open.png";
import Lixeira from "../../public/icons/remove.png";
import Lapis from "../../public/icons/edit.png";

interface TabelaContatosProps {
  desbloquearTodos: boolean;
  filtrar: string;
  busca: string;
}

export default function TabelaContatos({
  desbloquearTodos,
  filtrar,
  busca,
}: TabelaContatosProps) {
  const contatosSession = sessionStorage.getItem("contatos");
  const contatos: Contato[] = contatosSession
    ? JSON.parse(contatosSession)
    : [];

  const [modalAberto, setModalAberto] = useState(false);
  const [contatoAtualIdx, setContatoAtualIdx] = useState<number | null>(null);
  const [desbloqueados, setDesbloqueados] = useState<number[]>([]);
  const [mostrarModalContato, setMostrarModalContato] =
    useState<boolean>(false);
  const [contatoSelecionado, setContatoSelecionado] = useState<
    Contato | undefined
  >();
  const [tipoModal, setTipoModal] = useState<string>("add");

  const contatosFiltrados = contatos
    .filter((c) => {
      const nomeUpper = c.nome.toUpperCase();
      const filtrarUpper = filtrar?.toUpperCase() || "";
      const buscaUpper = busca?.toUpperCase() || "";

      // Filtrar por letra inicial
      const filtrarOk = filtrarUpper
        ? nomeUpper.startsWith(filtrarUpper)
        : true;

      // Buscar por substring
      const buscaOk = buscaUpper ? nomeUpper.includes(buscaUpper) : true;

      return filtrarOk && buscaOk;
    })
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
        const novosContatos = contatos.filter(
          (c) => c.contato_id !== contatoId
        );
        sessionStorage.setItem("contatos", JSON.stringify(novosContatos));
      }

      // Re-render
      setDesbloqueados((prev) =>
        prev.filter(
          (_, idx) => contatosFiltrados[idx]?.contato_id !== contatoId
        )
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
          <tr key={"tr-table"} className="text-left">
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
          {contatosFiltrados.map((contato) => {
            const desbloqueado =
              desbloqueados.includes(contato.contato_id!) || desbloquearTodos;

            return (
              <React.Fragment key={contato.contato_id}>
                <tr className="align-middle">
                  <td className="py-8">
                    <div className="flex items-center gap-3">
                      <img
                        src={contato.foto as string}
                        className="w-12 h-12 rounded-xl"
                      />
                      <div>
                        <p className="text-[var(--body)] text-sm font-medium">
                          {contato.nome}
                        </p>
                        <p className="text-[var(--muted)] text-xs">
                          {contato.relacao}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-[var(--body)] text-sm py-4">
                    {desbloqueado
                      ? contato.telefone
                      : "*".repeat(contato.telefone.length)}
                  </td>
                  <td className="text-[var(--body)] text-sm py-4">
                    {desbloqueado
                      ? contato.email
                      : "*".repeat(contato.email.length)}
                  </td>
                  <td className="py-4">
                    <div className="flex lg:flex-row gap-2 md:flex-col md:w-max md:items-center">
                      <Button
                        icon={Lapis}
                        label="Editar"
                        variant={ButtonVariant.Tertiary}
                        onClick={() => {
                          setTipoModal("edit");
                          setContatoSelecionado(contato);
                          setMostrarModalContato(true);
                        }}
                      />
                      <div className="md:flex md:gap-2">
                        <IconButton
                          border={true}
                          imagem={desbloqueado ? CadeadoAberto : CadeadoFechado}
                          ativo={false}
                          onClick={() =>
                            abrirModalOuBloquear(contato.contato_id!)
                          }
                        />
                        <IconButton
                          border={true}
                          imagem={Lixeira}
                          ativo={false}
                          onClick={() => removerContato(contato.contato_id!)}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Separador */}
                <tr>
                  <td colSpan={4}>
                    <hr className="h-px w-full my-4 bg-[var(--muted)] border-0" />
                  </td>
                </tr>
              </React.Fragment>
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

      {mostrarModalContato && (
        <ModalContato
          tipo={tipoModal}
          contato={contatoSelecionado}
          onClose={() => setMostrarModalContato(false)}
        />
      )}
    </>
  );
}
