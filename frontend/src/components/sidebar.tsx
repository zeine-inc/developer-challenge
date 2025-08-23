import { useState } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from "../components/iconbutton";

import AccountActive from "../../public/icons/acconunt_active.png";
import SettingActive from "../../public/icons/settings_active.png";
import LogoutActive from "../../public/icons/logout_active.png";
import Logo from "../../public/icons/logo.png";

export default function SideBar() {
  const acoesIcones = [
    { id: 0, imagem: AccountActive },
    { id: 1, imagem: SettingActive },
    { id: 2, imagem: LogoutActive },
  ];

  // Inicializa ativo com o ID do primeiro botão
  const [ativo, setAtivo] = useState<number>(0);
  const navigate = useNavigate();

  return (
    <section
      aria-label="Menu de Opções"
      className="h-[100vh] flex flex-col justify-between p-[5rem] items-center">
      <img src={Logo} className="w-[1.81rem] h-[1.98rem]" />
      <div className="flex flex-col gap-[1rem] w-max text-center">
        {acoesIcones.map((acao) => (
          <IconButton
            key={acao.id}
            imagem={acao.imagem}
            ativo={ativo === acao.id} // compara com o estado
            onClick={() => {
              setAtivo(acao.id);
              if (acao.id == 2) {
                sessionStorage.clear();
                navigate("/");
              }
            }}
          />
        ))}
      </div>
      <div>
        <p className="text-[0.875rem] text-[var(--muted)]">Logado como:</p>
        <p className="text-[0.875rem] text-[var(--body)]">
          {sessionStorage.getItem("email")}
        </p>
      </div>
    </section>
  );
}
