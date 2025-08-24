import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SideBar from "../components/sidebar";
import PageContato from "./contatos";
import PageConfiguracoes from "./configuracoes";

export default function PageInicio() {
  const navigate = useNavigate();
  const [pageAlvo, setPageAlvo] = useState<number>(0);

  if (!sessionStorage.getItem("email")) {
    return (
      <div className="w-[100vw] h-[100vh] flex justify-center items-center">
        <p>É preciso estar logado!</p>
        <button onClick={() => navigate("/")}>Ir para o login</button>
      </div>
    );
  }

  return (
    <section className="flex flex-col lg:flex-row">
      <SideBar mudarPagina={(id: number) => setPageAlvo(id)} />

      {pageAlvo === 0 ? <PageContato /> : <PageConfiguracoes />}
    </section>
  );
}
