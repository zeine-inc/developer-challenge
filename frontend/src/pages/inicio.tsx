import { useNavigate } from "react-router-dom";

import PageContato from "./contatos";

export default function PageInicio() {
  const navigate = useNavigate();

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
      <PageContato />
    </section>
  );
}
