from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Path
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from database.database import engine, Vendedor, Contato
from models.models import VendedorCreate, VendedorLogin
from utils.criptografar import hash_senha, criptografar_email, verificar_senha
import cloudinary
import cloudinary.uploader
from os import getenv
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloudinary_url=getenv("CLOUDINARY_URL"),
    secure=True
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        
        return {"status": 200, "id": vendedor_login.id}
    finally:
        db.close()

@app.post("/cadastrarContato")
async def cadastrar_contatos(
    vendedor_id: int,
    nome: str = Form(...),
    email: str = Form(...),
    telefone: str = Form(...),
    foto: UploadFile = File(...)
):
    db = SessionLocal()

    vendedor = db.query(Vendedor).filter(Vendedor.id == vendedor_id).first()

    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    
    try:
        # Verificação de duplicidade de contato
        contato = db.query(Contato).filter(
            (Contato.email == email) | (Contato.telefone == telefone)
        ).first()

        if not contato:
            resultado_upload = cloudinary.uploader.upload(foto.file)
            url_imagem = resultado_upload.get("secure_url")
            if not url_imagem:
                raise HTTPException(status_code=500, detail="Erro ao fazer upload da imagem")

            contato = Contato(
                nome=nome,
                email=email,
                telefone=telefone,
                foto=url_imagem
            )
            db.add(contato)
            db.commit()
            db.refresh(contato)

        # Vinculação de contato ao vendedor
        if contato not in vendedor.contatos:
            vendedor.contatos.append(contato)
            db.commit()

        return {
            "status": 200,
            "contato_id": contato.id,
            "vendedor_id": vendedor.id,
            "nome": contato.nome,
            "email": contato.email,
            "telefone": contato.telefone,
            "foto": contato.foto
        }

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Erro de integridade no banco de dados")

@app.put("/editarContato/{vendedor_id}/{contato_id}")
async def editar_contato(
    vendedor_id: int = Path(...),
    contato_id: int = Path(...),
    nome: str = Form(None),
    email: str = Form(None),
    telefone: str = Form(None),
    foto: UploadFile = File(None),
):
    db = SessionLocal()

    # Verifica se vendedor existe
    vendedor = db.query(Vendedor).filter(Vendedor.id == vendedor_id).first()
    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")

    # Verifica se contato existe
    contato = db.query(Contato).filter(Contato.id == contato_id).first()
    if not contato:
        raise HTTPException(status_code=404, detail="Contato não encontrado")

    try:
        # Atualiza campos se vierem
        if nome:
            contato.nome = nome
        if email:
            contato.email = email
        if telefone:
            contato.telefone = telefone

        # Upload de nova imagem, se fornecida
        if foto:
            resultado_upload = cloudinary.uploader.upload(foto.file)
            url_imagem = resultado_upload.get("secure_url")
            if not url_imagem:
                raise HTTPException(status_code=500, detail="Falha ao fazer upload da imagem")
            contato.foto = url_imagem

        # Vincula o contato ao vendedor caso ainda não exista
        if contato not in vendedor.contatos:
            vendedor.contatos.append(contato)

        db.commit()
        db.refresh(contato)

        return {
            "status": 200,
            "contato_id": contato.id,
            "vendedor_id": vendedor.id,
            "nome": contato.nome,
            "email": contato.email,
            "telefone": contato.telefone,
            "foto": contato.foto
        }

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Erro de integridade no banco de dados")
    
@app.get("/vendedor/{vendedor_id}/contatos")
def listar_contatos_vendedor(
    vendedor_id: int = Path(...),
):
    db = SessionLocal()

    # Verifica se o vendedor existe
    vendedor = db.query(Vendedor).filter(Vendedor.id == vendedor_id).first()
    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    
    # Acessa os contatos associados via relacionamento
    contatos = [
        {
            "id": contato.id,
            "nome": contato.nome,
            "email": contato.email,
            "telefone": contato.telefone,
            "foto": contato.foto
        }
        for contato in vendedor.contatos
    ]

    return {"status": 200, "contatos": contatos}