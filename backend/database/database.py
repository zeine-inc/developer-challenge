from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import declarative_base, relationship
from os import getenv
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

class VendedorContato(Base):
    __tablename__ = "vendedor_contato"
    id_vendedor = Column(Integer, ForeignKey("vendedor.id"), primary_key=True)
    id_contato = Column(Integer, ForeignKey("contato.id"), primary_key=True)
    relacao = Column(String(255))

class Vendedor(Base):
    __tablename__ = 'vendedor'
    id = Column(Integer, primary_key=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    senha = Column(String(255), nullable=False)

class Contato(Base):
    __tablename__ = 'contato'
    id = Column(Integer, primary_key=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), unique=True)
    telefone = Column(String(255), unique=True)
    foto = Column(String(255))

engine = create_engine(getenv("DATABASE_URL"))
Base.metadata.create_all(engine)
