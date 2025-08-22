import { PageApresentacao } from "../components/pagina_apresentacao";
import { LinkSingLog } from "../components/link_singlog";
import TextField from "../components/text_field";
import Button, { ButtonVariant } from "../components/button";
import CancelRed from "../../public/icons/cancel_red.png";

export function PageCadastro() {
  const validacoesSenha: string[] = [
    "Pelo menor 8 caracteres",
    "Contéum um número ou símbolo",
    "As senhas devem ser iguais",
  ];

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
            placeholder="Como você se chama?"
            label="Nome"
            type="text"
          />
          <TextField placeholder="Seu e-mail aqui" label="E-mail" type="text" />
          <TextField
            placeholder="Escolha uma senha segura"
            label="Senha"
            type="password"
          />
          <TextField
            placeholder="Repita sua senha para confirmar"
            label="Repetir a senha"
            type="password"
          />
        </div>

        {/* Validações de senha */}
        <section className="w-full mt-4 space-y-2">
          {validacoesSenha.map((validacao, index) => (
            <div key={index} className="flex items-center gap-2">
              <img className="w-[1rem] h-[1rem]" src={CancelRed} alt="erro" />
              <p className="text-[0.875rem] text-[var(--body)]">{validacao}</p>
            </div>
          ))}
        </section>

        {/* Botão criar conta */}
        <div className="mt-6 w-full flex justify-end">
          <Button label="Criar conta" variant={ButtonVariant.Primary} />
        </div>
      </section>
    </main>
  );
}
