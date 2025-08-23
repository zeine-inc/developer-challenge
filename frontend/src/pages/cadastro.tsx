import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PageApresentacao from "../components/pagina_apresentacao";
import LinkSingLog from "../components/link_singlog";
import TextField from "../components/text_field";
import Button, { ButtonVariant } from "../components/button";

import CancelRed from "../../public/icons/cancel_red.png";
import RightActive from "../../public/icons/right_active.png";

import { emailValido, validarSenha } from "../utils/validar";
import { cadastrar } from "../service/service";

export function PageCadastro() {
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [senhaConfirmada, setSenhaConfirmada] = useState<string>("");

  // Mensagens para feedback do cadastro ao vendedor
  const [cadastroBool, setCadastro] = useState<boolean>(false);
  const [mensagemVisivel, setVisibilidade] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string>("");

  const navigate = useNavigate();

  const regras = [
    {
      texto: "Pelo menos 8 caracteres",
      valido: senha.length >= 8,
    },
    {
      texto: "Contém um número ou símbolo",
      valido: validarSenha(senha),
    },
    {
      texto: "As senhas devem ser iguais",
      valido: senha.length > 0 && senha === senhaConfirmada,
    },
  ];

  const fazerCadastro = async () => {
    const responseStatus = await cadastrar({
      nome: nome,
      senha: senha,
      email: email,
    });

    if (responseStatus === 200) {
      setMensagem("Cadastro realizado. Redirecionando para login!");
      setCadastro(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else if (responseStatus === 400) {
      setMensagem("E-mail já cadastrado");
      setEmail("");
    } else if (responseStatus === 422) {
      setMensagem("E-mail inválido");
      setEmail("");
    } else {
      setMensagem("Erro ao cadastrar");
    }

    setVisibilidade(true);
    setTimeout(() => {
      setVisibilidade(false), setMensagem("");
    }, 1500);
  };

  return (
    <main className="flex h-screen">
      <PageApresentacao />

      <section className="bg-[var(--background-secondary)] w-[30vw] h-screen flex flex-col justify-center px-25">
        <LinkSingLog href="/" page="Cadastro" />

        {/* Conteúdo central */}
        <div className="max-w-sm mx-auto w-full space-y-6 mt-[3rem]">
          <h2 className="text-[1.5rem] font-bold mb-6 text-white">
            Criar conta
          </h2>

          <TextField
            input={nome}
            onChange={setNome}
            placeholder="Como você se chama?"
            label="Nome"
            type="text"
          />
          <TextField
            input={email}
            onChange={setEmail}
            placeholder="Seu e-mail aqui"
            label="E-mail"
            type="text"
            error={!emailValido(email)}
          />
          <TextField
            input={senha}
            onChange={setSenha}
            placeholder="Escolha uma senha segura"
            label="Senha"
            type="password"
            error={!validarSenha(senha)}
          />
          <TextField
            input={senhaConfirmada}
            onChange={setSenhaConfirmada}
            placeholder="Repita sua senha para confirmar"
            label="Repetir a senha"
            type="password"
            error={senhaConfirmada !== senha}
          />
        </div>

        {/* Validações de senha */}
        <section className="w-full mt-4 space-y-2">
          {regras.map((regra, index) => (
            <div key={index} className="flex items-center gap-2">
              <img
                className="w-[1rem] h-[1rem]"
                src={regra.valido ? RightActive : CancelRed}
                alt={regra.valido ? "ok" : "erro"}
              />
              <p
                className={`text-[0.875rem] ${
                  regra.valido ? "text-[var(--brand)]" : "text-[var(--body)]"
                }`}>
                {regra.texto}
              </p>
            </div>
          ))}
        </section>
        {/* Botão criar conta */}
        <div className="mt-6 w-full flex justify-end">
          <Button
            label="Criar conta"
            variant={ButtonVariant.Primary}
            onClick={fazerCadastro}
          />
        </div>
        <p
          className={
            mensagemVisivel
              ? `text-[0.875rem] font-bold w-full text-center my-[1rem] ${
                  cadastroBool ? "text-[var(--brand)]" : "text-[var(--red)]"
                }`
              : "opacity-0"
          }>
          {mensagem}
        </p>
      </section>
    </main>
  );
}
