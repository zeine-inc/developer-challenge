import { PageApresentacao } from "../components/pagina_apresentacao";
import { LinkSingLog } from "../components/link_singlog";
import TextField from "../components/text_field";
import Button, { ButtonVariant } from "../components/button";

export function PageLogin() {
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
          />

          <TextField
            placeholder="Insira sua senha"
            label="Senha"
            type="password"
          />

          <div className="w-full flex justify-end">
            <Button label="Acessar conta" variant={ButtonVariant.Primary} />
          </div>
        </div>
      </section>
    </main>
  );
}
