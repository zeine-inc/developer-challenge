import pytest
import sys
from pathlib import Path
from faker import Faker
from fastapi import HTTPException
from random import randint

sys.path.append(str(Path(__file__).resolve().parent.parent))

from routes.contato import cadastrar_contatos, editar_contato, excluir_contato, listar_contatos_vendedor
from database.database import SessionLocal, Contato, VendedorContato
from utils.criptografar import criptografar_telefone

faker = Faker()
nome_fake = faker.name().split()[0].lower()
email_fake = nome_fake + '@gmail.com'
vendedor_id = 1

# Gera telefone fake puro (sem criptografia)
telefone_fake = ''.join([str(randint(0, 9)) for _ in range(11)])


@pytest.fixture
def limpar_telefone_teste():
    db = SessionLocal()
    telefone_criptografado = criptografar_telefone(telefone_fake)

    # Limpeza antes do teste
    db.query(VendedorContato).filter(VendedorContato.id_contato.in_(
        db.query(Contato.id).filter(Contato.telefone == telefone_criptografado)
    )).delete(synchronize_session=False)

    db.query(Contato).filter(Contato.telefone == telefone_criptografado).delete()
    db.commit()

    yield telefone_fake  # sempre devolve puro

    # Limpeza após o teste
    db.query(VendedorContato).filter(VendedorContato.id_contato.in_(
        db.query(Contato.id).filter(Contato.telefone == telefone_criptografado)
    )).delete(synchronize_session=False)
    db.query(Contato).filter(Contato.telefone == telefone_criptografado).delete()
    db.commit()
    db.close()


def test_cadastrar_contato(limpar_telefone_teste):
    telefone_fake = limpar_telefone_teste
    
    resultado = cadastrar_contatos(
        vendedor_id=vendedor_id,
        nome=nome_fake,
        telefone=telefone_fake,
        email=email_fake,
        relacao='Colega',
        foto=""
    )

    assert resultado['status'] == 200

    with pytest.raises(HTTPException) as exc_info:
        # Teste para duplicado
        cadastrar_contatos(
            vendedor_id=vendedor_id,
            nome=nome_fake,
            telefone=telefone_fake,
            email=email_fake,
            relacao='Colega',
            foto=""
        )

    assert exc_info.value.status_code == 400
    print("Contato já existente detectado ✅")


def test_editar_contato(limpar_telefone_teste):
    telefone_fake = limpar_telefone_teste
    db = SessionLocal()

    resultado_cadastro = cadastrar_contatos(
        vendedor_id=vendedor_id,
        nome=nome_fake,
        telefone=telefone_fake,
        email=email_fake,
        relacao='Colega',
        foto=''
    )
    contato_id = resultado_cadastro['contato_id']

    # Verifica se a relação foi criada no banco
    assoc = db.query(VendedorContato).filter_by(
        id_vendedor=vendedor_id,
        id_contato=contato_id
    ).first()
    assert assoc is not None
    assert assoc.relacao == 'Colega'

    # Editar contato existente
    resultado_edicao = editar_contato(
        vendedor_id=vendedor_id,
        contato_id=contato_id,
        nome=nome_fake + "_editado",
        telefone=telefone_fake,
        email=email_fake,
        relacao='Amigo',
        foto=''
    )

    assert resultado_edicao['status'] == 200
    assert resultado_edicao['nome'] == nome_fake + "_editado"
    assert resultado_edicao['relacao'] == 'Amigo'
    print("Contato editado com sucesso ✅")
    db.close()


def test_excluir_contato(limpar_telefone_teste):
    telefone_fake = limpar_telefone_teste
    db = SessionLocal()

    resultado_cadastro = cadastrar_contatos(
        vendedor_id=vendedor_id,
        nome=nome_fake,
        telefone=telefone_fake,
        email=email_fake,
        relacao="Colega",
        foto=""
    )
    contato_id = resultado_cadastro["contato_id"]

    contato_obj = {
        "vendedor_id": vendedor_id,
        "contato_id": contato_id
    }

    # Garantir que a relação vendedor-contato foi criada
    relacao = db.query(VendedorContato).filter_by(
        id_vendedor=vendedor_id,
        id_contato=contato_id
    ).first()
    assert relacao is not None

    # Executar exclusão
    resultado_exclusao = excluir_contato(contato_obj)
    assert resultado_exclusao["status"] == 200

    relacao = db.query(VendedorContato).filter_by(
        id_vendedor=vendedor_id,
        id_contato=contato_id
    ).first()
    assert relacao is None

    contato_existe = db.query(Contato).filter_by(id=contato_id).first()
    assert contato_existe is not None
    print("Contato desvinculado do vendedor, mas ainda existe no banco ✅")

    db.close()


def test_listar_contatos():
    resultado = listar_contatos_vendedor(vendedor_id=vendedor_id) 
    assert resultado["contatos"]
