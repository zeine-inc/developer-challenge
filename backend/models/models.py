from pydantic import BaseModel, EmailStr


class VendedorCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str

class VendedorLogin(BaseModel):
    email: EmailStr
    senha: str 