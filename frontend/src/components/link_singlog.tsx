import { Link } from "react-router-dom";

interface LinkSingLog {
  href: string;
  page: "Cadastro" | "Login";
}

export function LinkSingLog({ href, page }: LinkSingLog) {
  return (
    <p className="text-right text-[0.75rem] mb-8 text-[var(--body)]">
      {page == "Cadastro" ? "Já tem uma conta?" : "Não tem uma conta?"}
      <Link
        to={href}
        className="text-[var(--brand)] text-[0.75rem] font-medium cursor-pointer">
        {page == "Cadastro" ? " Acessar conta" : " Criar conta"}
      </Link>
    </p>
  );
}
