import { useState } from "react";
import TextField from "../components/text_field";
import { validarSenha } from "../utils/validar";
import Button from "../components/button";

import { editarVendedor } from "../service/service";

export default function PageConfiguracoes() {
  const [nome, setNome] = useState<string>(
    sessionStorage.getItem("nome") || ""
  );
  const [senhaAntiga, setSenhaAntiga] = useState<string>("");
  const [senhaNova, setSenhaNova] = useState<string>("");
  const [labelButton, setLabelButton] = useState<string>("Salvar informações");
  const id = Number(sessionStorage.getItem("id"));
  const senhaAtual = sessionStorage.getItem("senha");

  const editar = async () => {
    setLabelButton("Carregando...");
    const responseStatus = await editarVendedor(id, nome, senhaNova);
    if (responseStatus === 200) {
      setLabelButton("Dados salvos!");
      if (nome) sessionStorage.setItem("nome", nome);
      if (senhaNova) sessionStorage.setItem("senha", senhaNova);
      setSenhaAntiga("");
      setSenhaNova("");
    } else {
      setLabelButton("Erro ao salvar os dados");
    }

    setTimeout(() => {
      setLabelButton("Salvar informações");
    }, 1500);
  };

  return (
    <div className="mt-20 md:mx-10 lg:mt-32 bg-[var(--background-secondary)] w-full lg:w-4/5 h-[70vh] lg:h-[80vh] rounded-3xl mx-auto lg:mx-0 p-8">
      <div className="flex justify-center items-center flex-col bg-[var(--background-secondary)] w-full rounded-3xl p-8">
        <h2 className="text-3xl font-bold w-full text-center text-white text-center mb-8">
          Olá, {sessionStorage.getItem("nome")?.toUpperCase()}!
        </h2>

        <div className="flex flex-col gap-6 w-full justify-center items-center">
          <TextField
            label="Mudar meu nome"
            placeholder="Insira seu novo nome"
            type="text"
            input={nome}
            onChange={setNome}
          />

          <TextField
            label="Senha antiga"
            placeholder="Insira sua senha antiga"
            type="password"
            input={senhaAntiga}
            onChange={setSenhaAntiga}
            error={senhaAntiga !== senhaAtual && !validarSenha(senhaAntiga)}
            helper={
              senhaAntiga !== senhaAtual && senhaAntiga !== ""
                ? "A senha fornecida é diferente!"
                : ""
            }
          />

          <TextField
            label="Nova senha"
            placeholder="Insira sua nova senha"
            type="password"
            input={senhaNova}
            onChange={setSenhaNova}
            error={senhaNova !== "" && !validarSenha(senhaNova)}
            helper="A senha deve conter no mínimo 8 caracters e um caracter especial"
          />
        </div>

        {/* Botão de salvar */}
        <div className="mt-8 flex justify-center">
          <Button label={labelButton} onClick={editar} />
        </div>
      </div>
    </div>
  );
}
