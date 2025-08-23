from fastapi import APIRouter, HTTPException, Body
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from database.database import Vendedor, SessionLocal
from models.models import VendedorCreate, VendedorLogin
from utils.criptografar import criptografar_email, hash_senha, verificar_senha

router = APIRouter(prefix="/vendedor", tags=["Vendedor"])

@router.post("/cadastro")
def cadastrar_vendedor(vendedor: VendedorCreate):
    db = SessionLocal()
    try:
        novo_vendedor = Vendedor(
            nome=vendedor.nome,
            email=criptografar_email(vendedor.email),
            senha=hash_senha(vendedor.senha)
        )
        db.add(novo_vendedor)
        db.commit()
        db.refresh(novo_vendedor)
        return {"id": novo_vendedor.id, "nome": novo_vendedor.nome}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    finally:
        db.close()

@router.post("/login")
def login_vendedor(vendedor: VendedorLogin):
    db = SessionLocal()
    try:
        email_codificado = criptografar_email(vendedor.email)

        vendedor_login = db.query(Vendedor).filter(
            Vendedor.email == email_codificado
        ).first()

        if not vendedor_login:
            raise HTTPException(status_code=402, detail="Credenciais incorretas")
        
        if not verificar_senha(vendedor.senha, vendedor_login.senha):
            raise HTTPException(status_code=401, detail="Senha incorreta")
        
        return {
            "status": 200,
            "id": vendedor_login.id,
            "nome": vendedor_login.nome,
            "email": vendedor_login.email
        }
    finally:
        db.close()

@router.post("/editarVendedor")
def editar_vendedor(
    id: int = Body(..., embed=True),
    nome: str | None = Body(None, embed=True),
    senha: str | None = Body(None, embed=True)
):
    db = SessionLocal()
    try:
        vendedor = db.query(Vendedor).filter(Vendedor.id == id).first()
        if not vendedor:
            raise HTTPException(status_code=404, detail="Vendedor não encontrado")

        # Atualiza os campos enviados
        if nome is not None:
            vendedor.nome = nome
        if senha is not None:
            vendedor.senha = hash_senha(senha)

        db.commit()
        db.refresh(vendedor)
        return {
            "status": "sucesso",
            "id": vendedor.id,
            "nome": vendedor.nome
        }

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao atualizar vendedor")
    finally:
        db.close()