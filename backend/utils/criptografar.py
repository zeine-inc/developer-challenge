from passlib.context import CryptContext
import base64


def hash_senha(senha: str) -> str:
    return pwd_context.hash(senha)

def verificar_senha(senha_fornecida: str, senha_hash: str) -> bool:
    return pwd_context.verify(senha_fornecida, senha_hash)

def criptografar_email(email: str) -> str:
    return base64.b64encode(email.encode()).decode()

def descriptografar_email(email_codificado: str) -> str:
    return base64.b64decode(email_codificado.encode()).decode()

def criptografar_telefone(telefone: str) -> str:
    return base64.b64encode(telefone.encode()).decode()

def descriptografar_telefone(telefone_codificado: str) -> str:
    return base64.b64decode(telefone_codificado.encode()).decode()


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
