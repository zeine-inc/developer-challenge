export function emailValido(email: string) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

export function validarSenha(senha: string) {
  const senhaRegex = /^(?=.*[\d\W]).{8,}$/;
  return senhaRegex.test(senha);
}

export function validarTelefone(telefone: string) {
  const telefoneRegex = /^\d{11}$/;
  return telefoneRegex.test(telefone);
}
