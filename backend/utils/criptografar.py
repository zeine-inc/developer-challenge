from passlib.context import CryptContext
import base64


def hash_senha(senha: str) -> str:
    return pwd_context.hash(senha)

def verificar_senha(senha_fornecida: str, senha_hash: str) -> bool:
    return pwd_context.verify(senha_fornecida, senha_hash)

def criptografar_email(email: str) -> str:
    return base64.b64encode(email.encode()).decode()


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
