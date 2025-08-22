import type {
  InterfaceCadastro,
  InterfaceLogin,
} from "../interfaces/interfaces";

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

    if (response.ok) return response.status;
    else {
      console.error(data);
      return response.status;
    }
  } catch (e) {
    console.error(`Erro ao cadastrar: ${e} `);
    return 500;
  }
}

export async function login({ ...props }: InterfaceLogin) {
  try {
    const response = await fetch("http://127.0.0.1:8000/login", {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email: props.email, senha: props.senha }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("email", props.email);
      localStorage.setItem("id", data.id);
      localStorage.setItem("nome", data.nome);
      return response.status;
    } else {
      console.error(data);
      return response.status;
    }
  } catch (e) {
    console.error(`Erro ao fazer login: ${e}`);
  }
}
