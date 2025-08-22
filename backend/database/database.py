from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import declarative_base, relationship
from os import getenv
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

vendedor_contato = Table(
    'vendedor_contato', Base.metadata,
    Column('id_vendedor', Integer, ForeignKey('vendedor.id'), primary_key=True),
    Column('id_contato', Integer, ForeignKey('contato.id'), primary_key=True),
    Column('relacao', String(255))
)

class Vendedor(Base):
    __tablename__ = 'vendedor'
    id = Column(Integer, primary_key=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    senha = Column(String(255), nullable=False)
    contatos = relationship('Contato', secondary=vendedor_contato, back_populates='vendedores')

class Contato(Base):
    __tablename__ = 'contato'
    id = Column(Integer, primary_key=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), unique=True)
    telefone = Column(String(255), unique=True)
    foto = Column(String(255))
    vendedores = relationship('Vendedor', secondary=vendedor_contato, back_populates='contatos')

engine = create_engine(getenv("DATABASE_URL"))
Base.metadata.create_all(engine)
