import { PageLogin } from "../pages/login";
import { PageCadastro } from "../pages/cadastro";

export const myRoutes = [
  { path: "/", element: <PageLogin /> },
  { path: "/cadastro", element: <PageCadastro /> },
];
