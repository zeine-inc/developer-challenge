import { useState } from "react";

import Lupa from "../../public/icons/search.png";
import Cadeado from "../../public/icons/lock.png";

import type { Contato } from "../interfaces/interfaces";

import SideBar from "../components/sidebar";
import TextField from "../components/text_field";
import Button, { ButtonVariant } from "../components/button";
import IconButton from "../components/iconbutton";
import FiltroAlfabeto from "../components/filtrar";
import TabelaContatos from "../components/tabela_contatos";
import ModalInformacoes from "../components/modalInformacoes";
import ModalContato from "../components/modalContato";

export default function PageInicio() {
  const [busca, setBusca] = useState<string>("");
  const [letraFiltar, setLetraFiltrar] = useState<string>("");
  const [mostrarModalInformacoes, setMostrarModalInformacoes] =
    useState<boolean>(false);
  const [mostrarModalContato, setMostrarModalContato] =
    useState<boolean>(false);
  const [contatoSelecionado, setContatoSelecionado] = useState<
    Contato | undefined
  >();
  const [tipoModal, setTipoModal] = useState<string>("add");

  return (
    <section aria-label="Página de contatos" className="flex">
      <SideBar />
      <div className="mt-[8rem] bg-[var(--background-secondary)] w-[80%] h-[80vh] rounded-[3rem]">
        <div
          aria-label="Seção do cabeçalho da página"
          className="flex items-center justify-between gap-4 p-4 rounded-lg mt-[2rem]">
          {/* Título */}
          <h2 className="ml-[5rem] text-[2rem] font-bold text-white">
            Lista de contatos
          </h2>

          <div className="flex gap-[1rem] p-[1rem]">
            {/* Campo de busca */}
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

            {/* Botão adicionar */}
            <Button
              label="+ Adicionar contato"
              variant={ButtonVariant.Secondary}
              onClick={() => {
                setMostrarModalContato(true);
                setTipoModal("add");
              }}
            />

            <IconButton
              imagem={Cadeado}
              ativo={false}
              onClick={() => setMostrarModalInformacoes(true)}
            />
          </div>
        </div>
        <div className="flex px-[4rem] w-full">
          <FiltroAlfabeto
            letras={"ABCDEFGHIJKLMNO".split("")}
            onSelecionar={setLetraFiltrar}
          />

          <div aria-label="Sessão de Contatos" className="flex flex-col w-full">
            {/* Cabeçalho do filtro */}
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
            />
          </div>
        </div>
      </div>

      {mostrarModalInformacoes && (
        <ModalInformacoes onClose={() => setMostrarModalInformacoes(false)} />
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
