import { useState } from "react";

import Lupa from "../../public/icons/search.png";
import CadeadoFechado from "../../public/icons/lock.png";
import CadeadoAberto from "../../public/icons/lock_open.png";

import type { Contato } from "../interfaces/interfaces";

import SideBar from "../components/sidebar";
import TextField from "../components/text_field";
import Button, { ButtonVariant } from "../components/button";
import IconButton from "../components/iconbutton";
import FiltroAlfabeto from "../components/filtrar";
import TabelaContatos from "../components/tabela_contatos";
import ModalContato from "../components/modalContato";
import ModalInformacoes from "../components/modalInformacoes";

export default function PageInicio() {
  const [busca, setBusca] = useState<string>("");
  const [letraFiltar, setLetraFiltrar] = useState<string>("");
  const [mostrarModalContato, setMostrarModalContato] =
    useState<boolean>(false);
  const [contatoSelecionado, setContatoSelecionado] = useState<
    Contato | undefined
  >();
  const [tipoModal, setTipoModal] = useState<string>("add");

  const [desbloquearTodos, setDesbloquearTodos] = useState<boolean>(false);
  const [modalSenhaGlobal, setModalSenhaGlobal] = useState<boolean>(false);

  return (
    <section aria-label="Página de contatos" className="flex">
      <SideBar />
      <div className="mt-[8rem] bg-[var(--background-secondary)] w-[80%] h-[80vh] rounded-[3rem]">
        <div className="flex items-center justify-between gap-4 p-4 rounded-lg mt-[2rem]">
          <h2 className="ml-[5rem] text-[2rem] font-bold text-white">
            Lista de contatos
          </h2>

          <div className="flex gap-[1rem] p-[1rem]">
            <div className="flex-1 w-[25rem]">
              <TextField
                label=""
                input={busca}
                onChange={setBusca}
                type="text"
                placeholder="Pesquisar"
                icon={Lupa}
              />
            </div>

            <Button
              label="+ Adicionar contato"
              variant={ButtonVariant.Secondary}
              onClick={() => {
                setMostrarModalContato(true);
                setTipoModal("add");
              }}
            />

            {/* Cadeado global que abre modal de senha */}
            <IconButton
              imagem={desbloquearTodos ? CadeadoAberto : CadeadoFechado}
              ativo={false}
              onClick={() => {
                if (desbloquearTodos === true) {
                  setDesbloquearTodos(false);
                } else {
                  setModalSenhaGlobal(true);
                }
              }}
            />
          </div>
        </div>

        <div className="flex px-[4rem] w-full">
          <FiltroAlfabeto
            letras={"ABCDEFGHIJKLMNO".split("")}
            onSelecionar={setLetraFiltrar}
          />

          <div aria-label="Sessão de Contatos" className="flex flex-col w-full">
            <div aria-label="Resultado do filtro" className="p-[2rem]">
              <p className="font-bold text-[0.875rem] text-[var(--primary)]">
                {letraFiltar}
              </p>
              <hr className="h-px w-[102%] my-4 bg-[var(--primary)] border-0" />
            </div>

            <TabelaContatos
              onEditar={(contato) => {
                if (contato != null) {
                  setTipoModal("edit");
                  setContatoSelecionado(contato);
                  setMostrarModalContato(true);
                }
              }}
              desbloquearTodos={desbloquearTodos}
            />
          </div>
        </div>
      </div>

      {/* Modal global de senha */}
      {modalSenhaGlobal && (
        <ModalInformacoes
          onClose={() => setModalSenhaGlobal(false)}
          onConfirm={(senhaDigitada: string) => {
            const senhaSalva = sessionStorage.getItem("senha");
            if (senhaDigitada === senhaSalva) {
              setDesbloquearTodos(true);
              setModalSenhaGlobal(false);
            }
          }}
        />
      )}

      {mostrarModalContato && (
        <ModalContato
          tipo={tipoModal}
          contato={contatoSelecionado}
          onClose={() => setMostrarModalContato(false)}
        />
      )}
    </section>
  );
}
