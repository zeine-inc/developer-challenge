import pytest
import sys
from pathlib import Path
from fastapi import HTTPException
from faker import Faker

faker = Faker()
nome_fake = faker.name().split()[0].lower()
email_fake = nome_fake + '@gmail.com'

sys.path.append(str(Path(__file__).resolve().parent.parent))

from routes.vendedor import cadastrar_vendedor, login_vendedor, editar_vendedor
from models.models import VendedorCreate, VendedorLogin
from database.database import SessionLocal, Vendedor
from utils.criptografar import criptografar_email

@pytest.fixture
def limpar_email_teste():
    db = SessionLocal()
    email_criptografado = criptografar_email(email_fake)
    
    # Garantir exclusão do teste
    db.query(Vendedor).filter(Vendedor.email == email_criptografado).delete()
    db.commit()
    
    yield email_fake
    
    # Garantir limpeza depois do teste
    db.query(Vendedor).filter(Vendedor.email == email_criptografado).delete()
    db.commit()
    db.close()


def test_cadastrar_vendedor_integridade(limpar_email_teste):
    emailFake = limpar_email_teste
    nomeFake = emailFake.split('@')[0]

    vendedor_obj = VendedorCreate(
        nome=nomeFake,
        email=emailFake,
        senha="1234"
    )
    vendedor_cadastrado = cadastrar_vendedor(vendedor_obj)
    assert vendedor_cadastrado["nome"] == nomeFake

    # Segundo cadastro com mesmo email (deve falhar)
    vendedor_obj_duplicado = VendedorCreate(
        nome=nomeFake,
        email=emailFake,
        senha="12345"
    )

    with pytest.raises(HTTPException) as exc_info:
        cadastrar_vendedor(vendedor_obj_duplicado)

    assert exc_info.value.detail == "Email já cadastrado"
    print("E-mail já existente detectado  ✅")

def test_login_vendedor(limpar_email_teste):
    emailFake = limpar_email_teste
    nomeFake = emailFake.split('@')[0]

    vendedor_cadastro = VendedorCreate(
        nome=nomeFake,
        email=emailFake,
        senha="1234"
    )
    cadastrar_vendedor(vendedor_cadastro)

    vendedor_login = VendedorLogin(
        email=emailFake,
        senha="1234"
    )
    resultado = login_vendedor(vendedor_login)
    assert resultado is not None
    print("Login realizado com sucesso ✅")

    # Login com senha incorreta
    vendedor_login_errado = VendedorLogin(
        email=emailFake,
        senha="senha_errada"
    )
    with pytest.raises(HTTPException) as exc_info:
        login_vendedor(vendedor_login_errado)

    assert exc_info.value.detail == "Senha incorreta"
    print("Erro de login com senha incorreta detectado ✅")

def test_edit_venedor(limpar_email_teste):
    emailFake = limpar_email_teste
    nomeFake = emailFake.split('@')[0]

    vendedor_cadastro_obj = VendedorCreate(
        nome=nomeFake,
        email=emailFake,
        senha="1235"
    )

    vendedor_cadastro = cadastrar_vendedor(vendedor_cadastro_obj)
    id_vendedor = vendedor_cadastro["id"]

    resultado = editar_vendedor(id=int(id_vendedor), nome=nomeFake, senha=None)
    
    assert resultado is not None