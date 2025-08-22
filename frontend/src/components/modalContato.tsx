import { useState, useEffect } from "react";

import type { Contato } from "../interfaces/interfaces";
import ImageUploader from "./imagem_uploader";
import { adicionarContato } from "../service/service";

import Fechar from "../../public/icons/cancel.png";
import Perfil from "../../public/images/perfil.png";
import TextField from "./text_field";
import Button, { ButtonVariant } from "./button";

interface ModalProps {
  onClose: () => void;
  tipo: string;
  contato?: Contato;
}

export default function ModalContato({ onClose, tipo, contato }: ModalProps) {
  const id_vendedor = sessionStorage.getItem("id");
  const [nome, setNome] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [relacao, setRelacao] = useState<string>("");
  const [foto, setFoto] = useState<string>("");
  const [fotoFile, setFotoFile] = useState<File>();

  const zerarCampos = () => {
    setNome("");
    setTelefone("");
    setEmail("");
    setRelacao("");
    setFoto(Perfil);
  };

  useEffect(() => {
    if (tipo.toLowerCase() === "edit" && contato) {
      setNome(contato.nome);
      setTelefone(contato.telefone);
      setEmail(contato.email);
      setRelacao(contato.relacao);
      setFoto(contato.foto as string);
    } else {
      zerarCampos();
    }
  }, [tipo, contato]);

  const salvarContato = async () => {
    const novoContato: Contato = {
      nome: nome,
      telefone: telefone,
      email: email,
      relacao: relacao,
      foto: fotoFile as File,
    };
    const responseStatus = await adicionarContato(novoContato, id_vendedor!);
    console.log(responseStatus);
  };

  return (
    <section
      aria-label="Janela flutuante"
      className="absolute inset-0 flex justify-center items-center backdrop-blur-md">
      <div className="bg-[var(--background-primary)] p-6 rounded-2xl w-[21rem] h-max relative">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-white text-lg font-bold">
            {tipo.toLowerCase() == "add"
              ? "Adicionar Contato"
              : "Editar Contato"}
          </h2>
          <img
            src={Fechar}
            className="w-5 h-5 cursor-pointer"
            onClick={() => {
              zerarCampos();
              onClose();
            }}
          />
        </div>

        <hr className="h-px w-[90%] my-3 bg-white" />

        <div className="flex flex-col justify-center items-center gap-5">
          <ImageUploader
            imagemContato={foto}
            onChange={setFoto}
            onFileChange={setFotoFile}
          />
        </div>

        {/* Input senha */}
        <div className="p-[0.5rem] flex flex-col gap-5">
          <TextField
            input={nome}
            onChange={setNome}
            label="Nome"
            placeholder="Nome do contato"
            type="text"
          />
          <TextField
            input={telefone}
            onChange={setTelefone}
            label="Telefone"
            placeholder="Número de Telefone"
            type="text"
          />
          <TextField
            input={email}
            onChange={setEmail}
            label="E-mail"
            placeholder="Email do contato"
            type="text"
          />
          <TextField
            input={relacao}
            onChange={setRelacao}
            label="Relacionamento"
            placeholder="Relacionamento com o contato"
            type="text"
          />
        </div>

        <hr className="h-px w-[90%] my-3  bg-[var(--muted)]" />

        {/* Ações */}
        <div className="flex gap-2 justify-end mt-[2rem]">
          <Button
            label="Cancelar"
            variant={ButtonVariant.Secondary}
            onClick={() => {
              zerarCampos();
              onClose();
            }}
          />
          <Button
            label="Salvar"
            variant={ButtonVariant.Primary}
            onClick={salvarContato}
          />
        </div>
      </div>
    </section>
  );
}
