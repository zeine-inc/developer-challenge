import { PageLogin } from "../pages/login";
import { PageCadastro } from "../pages/cadastro";
import PageInicio from "../pages/inicio";

export const myRoutes = [
  { path: "/", element: <PageLogin /> },
  { path: "/cadastro", element: <PageCadastro /> },
  { path: "/inicio", element: <PageInicio /> },
];
