import { useState } from "react";

import Lupa from "../../public/icons/search.png";
import CadeadoFechado from "../../public/icons/lock.png";
import CadeadoAberto from "../../public/icons/lock_open.png";

import TextField from "../components/text_field";
import IconButton from "../components/iconbutton";
import FiltroAlfabeto from "../components/filtrar";
import TabelaContatos from "../components/tabela_contatos";
import AdicionarContatoButton from "../components/adicionarContato";
import ModalContato from "../components/modalContato";
import ModalInformacoes from "../components/modalInformacoes";

export default function PageContato() {
  const [busca, setBusca] = useState<string>("");
  const [letraFiltrar, setLetraFiltrar] = useState<string>("");
  const [desbloquearTodos, setDesbloquearTodos] = useState<boolean>(false);
  const [modalSenhaGlobal, setModalSenhaGlobal] = useState<boolean>(false);
  const [modalAdicionarContato, setModalAdicionarContato] =
    useState<boolean>(false);

  return (
    <div className="mt-20 md:mx-10 lg:mt-32 bg-[var(--background-secondary)] w-full lg:w-4/5 h-[70vh] lg:h-[80vh] rounded-3xl mx-auto lg:mx-0">
      {/* Cabeçalho */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 rounded-lg mt-8 lg:mt-8">
        <h2 className="ml-0 lg:ml-20 text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          Lista de contatos
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <div className="flex-1 w-full sm:w-64 md:w-80">
            <TextField
              label=""
              input={busca}
              onChange={setBusca}
              type="text"
              placeholder="Pesquisar"
              icon={Lupa}
            />
          </div>

          <AdicionarContatoButton
            setModalAdicionarContato={setModalAdicionarContato}
          />

          <IconButton
            border={true}
            imagem={desbloquearTodos ? CadeadoAberto : CadeadoFechado}
            ativo={false}
            onClick={() => {
              if (desbloquearTodos) setDesbloquearTodos(false);
              else setModalSenhaGlobal(true);
            }}
          />
        </div>
      </div>

      {/* Filtro e Tabela */}
      <div className="flex flex-col lg:flex-row px-4 lg:px-16 w-full">
        <FiltroAlfabeto
          letras={"ABCDEFGHIJKLMNO".split("")}
          onSelecionar={setLetraFiltrar}
        />

        <div
          aria-label="Sessão de Contatos"
          className="flex flex-col w-full mt-4 lg:mt-0">
          <div aria-label="Resultado do filtro" className="p-4">
            <p className="font-bold text-xs sm:text-sm md:text-base text-[var(--primary)]">
              {letraFiltrar}
            </p>
            <hr className="h-px lg:w-[103%] md:w-full my-4 bg-[var(--primary)] border-0" />
          </div>

          <TabelaContatos
            desbloquearTodos={desbloquearTodos}
            filtrar={letraFiltrar}
            busca={busca}
          />
        </div>
      </div>

      {/* Modais */}
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

      {modalAdicionarContato && (
        <ModalContato
          tipo="add"
          onClose={() => setModalAdicionarContato(false)}
        />
      )}
    </div>
  );
}
