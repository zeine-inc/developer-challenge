import { useState } from "react";

import PageApresentacao from "../components/pagina_apresentacao";
import LinkSingLog from "../components/link_singlog";
import TextField from "../components/text_field";
import Button, { ButtonVariant } from "../components/button";

import { emailValido } from "../utils/validar";
import { login } from "../service/service";

export function PageLogin() {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  const [mensagem, setMensagem] = useState<string>("");
  const [mensagemVisivel, setVisivel] = useState<boolean>(false);
  const [sucesso, setSucesso] = useState<boolean>(false);

  const fazerLogin = async () => {
    const responseStatus = await login({ email, senha });

    if (responseStatus === 200) {
      setMensagem("Login efetuado com sucesso!");
      setSucesso(true);
    } else if (responseStatus === 401) {
      setMensagem("Credenciais incorretas");
      setSucesso(false);
    } else {
      setMensagem("Erro ao fazer login");
      setSucesso(false);
    }

    setVisivel(true);

    setTimeout(() => {
      setMensagem(""), setVisivel(false);
    }, 1000);
  };

  return (
    <main className="flex h-screen">
      <PageApresentacao />

      <section className="bg-[var(--background-secondary)] w-[30vw] h-screen flex flex-col justify-center px-25">
        <LinkSingLog href="/cadastro" page="Login" />

        <div className="max-w-sm mx-auto w-full space-y-6 my-[15rem]">
          <h2 className="text-2xl text-[1.5rem] font-bold mb-6 text-[var(--primary)]">
            Acessar conta
          </h2>

          <TextField
            placeholder="Digite seu e-mail"
            label="E-mail"
            type="text"
            input={email}
            onChange={setEmail}
            error={!emailValido(email)}
          />

          <TextField
            placeholder="Insira sua senha"
            label="Senha"
            type="password"
            input={senha}
            onChange={setSenha}
          />

          <div className="w-full flex justify-end">
            <Button
              label="Acessar conta"
              variant={ButtonVariant.Primary}
              onClick={fazerLogin}
            />
          </div>
          <p
            className={
              mensagemVisivel
                ? `text-[0.875rem] font-bold w-full text-center my-[1rem] ${
                    sucesso ? "text-[var(--brand)]" : "text-[var(--red)]"
                  }`
                : "opacity-0"
            }>
            {mensagem}
          </p>
        </div>
      </section>
    </main>
  );
}
