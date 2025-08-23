import type {
  Contato,
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
      await pegarContatos(data.id);
      sessionStorage.setItem("email", props.email);
      sessionStorage.setItem("id", data.id);
      sessionStorage.setItem("senha", props.senha);
      sessionStorage.setItem("nome", data.nome);
      return response.status;
    } else {
      console.error(data);
      return response.status;
    }
  } catch (e) {
    console.error(`Erro ao fazer login: ${e}`);
  }
}

export async function pegarContatos(id_vendedor: number) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/vendedor/${id_vendedor}/contatos`
    );
    const data = await response.json();

    if (response.ok) {
      sessionStorage.setItem("contatos", JSON.stringify(data.contatos));
    } else {
      sessionStorage.setItem("contatos", "[]");
    }
  } catch (e) {
    console.error(`Erro ao solicitar os contatos: ${e}`);
    sessionStorage.setItem("contatos", "[]");
  }
}

export async function adicionarContato(contato: Contato, vendedor_id: string) {
  try {
    const formData = new FormData();
    formData.append("vendedor_id", vendedor_id);
    formData.append("nome", contato.nome);
    formData.append("email", contato.email);
    formData.append("telefone", contato.telefone);
    formData.append("relacao", contato.relacao);

    if (contato.foto) {
      formData.append("foto", contato.foto);
    }

    const response = await fetch("http://127.0.0.1:8000/cadastrarContato", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      adicionarContatoNaSession(data);
      return response.status;
    }

    return response.status;
  } catch (e) {
    console.error(`Erro ao adicionar contato: ${e}`);
    return 500;
  }
}

function adicionarContatoNaSession(data: any) {
  try {
    // Recupera os contatos atuais da session
    const contatosStr = sessionStorage.getItem("contatos");
    const contatos: Contato[] = contatosStr ? JSON.parse(contatosStr) : [];

    const novoContato = { ...data };

    contatos.push(novoContato);

    sessionStorage.setItem("contatos", JSON.stringify(contatos));
  } catch (e) {
    console.error(`Erro ao atualizar contatos na session: ${e}`);
  }
}

export async function excluirContato(vendedor_id: string, contato_id: number) {
  try {
    const response = await fetch("http://127.0.0.1:8000/exlcuirContato", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        vendedor_id: Number(vendedor_id),
        contato_id: contato_id,
      }),
    });

    return response.status;
  } catch (e) {
    console.error(`Erro ao excluir o contato: ${e}`);
    return 500;
  }
}

export async function editarContato(contato: any) {
  const formData = new FormData();
  Object.keys(contato).forEach((key) => {
    formData.append(key, contato[key]);
  });

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/editarContato/${contato.vendedor_id}/${contato.contato_id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();

      const contatoAtualizado = {
        contato_id: data.contato_id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        foto: data.foto,
        relacao: data.relacao,
      };

      editarContatoNaSessionStorage(contatoAtualizado);
    }

    return response.status;
  } catch (e) {
    console.error("Erro ao editar contato:", e);
    return 500;
  }
}

function editarContatoNaSessionStorage(contatoAtualizado: any) {
  try {
    const contatosRaw = sessionStorage.getItem("contatos");
    if (!contatosRaw) return;

    let contatos = JSON.parse(contatosRaw);

    contatos = contatos.map((c: any) =>
      c.contato_id === contatoAtualizado.contato_id
        ? { ...c, ...contatoAtualizado }
        : c
    );

    sessionStorage.setItem("contatos", JSON.stringify(contatos));
  } catch (e) {
    console.error("Erro ao atualizar contato na sessionStorage:", e);
  }
}
