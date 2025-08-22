import type { InterfaceCadastro } from "../interfaces/interfaces";

export async function cadastrar({ ...props }: InterfaceCadastro) {
  try {
    const response = await fetch("http://127.0.0.1:8000/cadastro", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        nome: props.nome,
        email: props.email,
        senha: props.senha,
      }),
    });

    const data = await response.json();

    if (response.ok) return 200;
    else {
      console.error(data);
      return response.status;
    }
  } catch (e) {
    console.error(`Erro ao cadastrar: ${e} `);
    return 500;
  }
}
