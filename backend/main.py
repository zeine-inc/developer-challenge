from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from database.database import engine, Vendedor
from models.models import VendedorCreate
from utils.criptografar import hash_senha, criptografar_email

app = FastAPI()


# Sessão do SQLAlchemy
SessionLocal = sessionmaker(bind=engine, autoflush=False)

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
