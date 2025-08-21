from pydantic import BaseModel, EmailStr


class VendedorCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str
