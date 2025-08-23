import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Lupa from "../../public/icons/search.png";
import CadeadoFechado from "../../public/icons/lock.png";
import CadeadoAberto from "../../public/icons/lock_open.png";
import LinkQuebrado from "../../public/images/quebrado.png";

import SideBar from "../components/sidebar";
import TextField from "../components/text_field";
import Button from "../components/button";
import IconButton from "../components/iconbutton";
import FiltroAlfabeto from "../components/filtrar";
import TabelaContatos from "../components/tabela_contatos";
import ModalInformacoes from "../components/modalInformacoes";
import ModalContato from "../components/modalContato";
import AdicionarContatoButton from "../components/adicionarContato";

export default function PageInicio() {
  const [busca, setBusca] = useState<string>("");
  const [letraFiltar, setLetraFiltrar] = useState<string>("");
  const [desbloquearTodos, setDesbloquearTodos] = useState<boolean>(false);
  const [modalSenhaGlobal, setModalSenhaGlobal] = useState<boolean>(false);
  const [modalAdicionarContato, setModalAdicionarContato] =
    useState<boolean>(false);

  const navigate = useNavigate();

  if (!sessionStorage.getItem("email")) {
    return (
      <div className="w-[100vw] h-[100vh] flex justify-center items-center">
        <div className="flex justify-center items-center bg-[var(--background-secondary)] w-[90%] h-[80vh] rounded-[3rem]">
          <Button label="Ir para o login" onClick={() => navigate("/")} />
          <img
            src={LinkQuebrado}
            className="absolute w-[30rem] opacity-[0.2] z-0"
          />
          <p className="text-[var(--background-primary)] absolute text-[10rem] opacity-[0.5] top-15 z-0">
            OPS!
          </p>
          <p className="text-[var(--background-primary)] absolute text-[4rem] opacity-[0.5] top-55 z-0">
            É preciso estar logado!
          </p>
        </div>
      </div>
    );
  }

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

            <AdicionarContatoButton
              setModalAdicionarContato={setModalAdicionarContato}
            />

            {/* Cadeado global que abre modal de senha */}
            <IconButton
              border={true}
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
              desbloquearTodos={desbloquearTodos}
              filtrar={letraFiltar}
              busca={busca}
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

      {modalAdicionarContato && (
        <ModalContato
          tipo="add"
          onClose={() => setModalAdicionarContato(false)}
        />
      )}
    </section>
  );
}
