from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from database.database import Vendedor
from models.models import VendedorCreate, VendedorLogin
from utils.criptografar import criptografar_email, hash_senha, verificar_senha
from main import app, SessionLocal 

@app.post("/cadastro")
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

@app.post("/login")
def login_vendedor(vendedor: VendedorLogin):
    db = SessionLocal()

    try:
        # Verificar e-mail
        email_codificado = criptografar_email(vendedor.email)

        vendedor_login = db.query(Vendedor).filter(
            Vendedor.email == email_codificado
        ).first()

        if not vendedor_login:
            raise HTTPException(status_code=402, detail="Credenciais incorretas")
        
        # Verifica a senha
        if not verificar_senha(vendedor.senha, vendedor_login.senha):
            raise HTTPException(status_code=401, detail="Senha incorreta")
        
        return {"status": 200, "id": vendedor_login.id, "nome": vendedor_login.nome, "email": vendedor_login.email}
    finally:
        db.close()
