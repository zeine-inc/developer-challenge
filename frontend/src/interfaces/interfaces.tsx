export interface InterfaceLogin {
  email: string;
  senha: string;
}

export interface InterfaceCadastro extends InterfaceLogin {
  nome: string;
}
