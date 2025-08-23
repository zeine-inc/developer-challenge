export interface InterfaceLogin {
  email: string;
  senha: string;
}

export interface InterfaceCadastro extends InterfaceLogin {
  nome: string;
}

export interface Contato {
  contato_id?: number;
  nome: string;
  email: string;
  telefone: string;
  foto: string | File;
  relacao: string;
}
