export interface InterfaceLogin {
  email: string;
  senha: string;
}

export interface InterfaceCadastro extends InterfaceLogin {
  nome: string;
}

export interface Contato {
  nome: string;
  email: string;
  telefone: string;
  imagem: string;
  relacao: string;
}
