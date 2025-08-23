from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import sessionmaker
from database.database import engine
import cloudinary
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

from routes.vendedor import cadastrar_vendedor, login_vendedor
from routes.contato import cadastrar_contatos, editar_contato, listar_contatos_vendedor
