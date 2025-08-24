from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Path, Body
from sqlalchemy.exc import IntegrityError
import cloudinary.uploader

from database.database import Vendedor, Contato, VendedorContato, SessionLocal
from utils.criptografar import (
    criptografar_email, criptografar_telefone,
    descriptografar_email, descriptografar_telefone
)

router = APIRouter(prefix="/contato", tags=["Contato"])

@router.post("/cadastrarContato")
def cadastrar_contatos(
    vendedor_id: int = Form(...),
    nome: str = Form(...),
    email: str = Form(...),
    telefone: str = Form(...),
    relacao: str = Form(...),
    foto: UploadFile | None = File(None)
):
    db = SessionLocal()

    vendedor = db.query(Vendedor).filter(Vendedor.id == int(vendedor_id)).first()

    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    
    try:
        # Verificação de duplicidade de contato
        contato = db.query(Contato).filter(
            (Contato.email == email) | (Contato.telefone == telefone)
        ).first()

        if not contato:
            if foto:
                resultado_upload = cloudinary.uploader.upload(foto.file)
                url_imagem = resultado_upload.get("secure_url")
            else:
                url_imagem = "https://res.cloudinary.com/do4mpbste/image/upload/v1755986340/perfil_szewar.png"

            if not url_imagem:
                raise HTTPException(status_code=500, detail="Erro ao fazer upload da imagem")

            contato = Contato(
                nome=nome,
                email=criptografar_email(email),
                telefone=criptografar_telefone(telefone),
                foto=url_imagem,
            )
            db.add(contato)
            db.commit()
            db.refresh(contato)
        
        # Instância de VendedorContato para criação de relação
        assoc = db.query(VendedorContato).filter_by(
            id_vendedor=vendedor.id,
            id_contato=contato.id
        ).first()

        if not assoc:
            assoc = VendedorContato(
                id_vendedor=vendedor.id,
                id_contato=contato.id,
                relacao=relacao or ""
            )
            db.add(assoc)
            db.commit()
            db.refresh(assoc)

        return {
            "status": 200,
            "contato_id": contato.id,
            "vendedor_id": vendedor.id,
            "nome": contato.nome,
            "email": descriptografar_email(contato.email),
            "telefone": descriptografar_telefone(contato.telefone),
            "foto": contato.foto,
            "relacao": assoc.relacao if assoc else None,
        }

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Erro de integridade no banco de dados")

@router.put("/editarContato/{vendedor_id}/{contato_id}")
def editar_contato(
    vendedor_id: int = Path(...),
    contato_id: int = Path(...),
    nome: str = Form(None),
    email: str = Form(None),
    telefone: str = Form(None),
    relacao: str = Form(None),
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
            contato.email = criptografar_email(email)
        if telefone:
            contato.telefone = criptografar_telefone(telefone)

        # Upload de nova imagem, se fornecida
        if foto:
            resultado_upload = cloudinary.uploader.upload(foto.file)
            url_imagem = resultado_upload.get("secure_url")
            if not url_imagem:
                raise HTTPException(status_code=500, detail="Falha ao fazer upload da imagem")
            contato.foto = url_imagem

        # Atualiza ou cria a associação vendedor-contato
        assoc = db.query(VendedorContato).filter_by(
            id_vendedor=vendedor.id,
            id_contato=contato.id
        ).first()

        if assoc:
            if relacao:
                assoc.relacao = relacao  # Atualiza a relacao existente
        else:
            assoc = VendedorContato(
                id_vendedor=vendedor.id,
                id_contato=contato.id,
                relacao=relacao or ""
            )
            db.add(assoc)

        db.commit()
        db.refresh(contato)

        return {
            "status": 200,
            "contato_id": contato.id,
            "vendedor_id": vendedor.id,
            "nome": contato.nome,
            "email": descriptografar_email(contato.email),
            "telefone": descriptografar_telefone(contato.telefone),
            "foto": contato.foto,
            "relacao": assoc.relacao if assoc else None
        }

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Erro de integridade no banco de dados")
    
@router.get("/vendedor/{vendedor_id}/contatos")
def listar_contatos_vendedor(vendedor_id: int = Path(...)):
    db = SessionLocal()
    try:
        # Verifica se o vendedor existe
        vendedor = db.query(Vendedor).filter(Vendedor.id == vendedor_id).first()
        if not vendedor:
            raise HTTPException(status_code=404, detail="Vendedor não encontrado")

        # Busca os contatos associados via tabela de associação
        contatos_assoc = (
            db.query(Contato, VendedorContato.relacao)
            .join(VendedorContato, Contato.id == VendedorContato.id_contato)
            .filter(VendedorContato.id_vendedor == vendedor_id)
            .all()
        )

        contatos = []
        for contato, relacao in contatos_assoc:
            try:
                email = descriptografar_email(contato.email) if contato.email else None
            except Exception:
                email = contato.email
            try:
                telefone = descriptografar_telefone(contato.telefone) if contato.telefone else None
            except Exception:
                telefone = contato.telefone

            contatos.append({
                "contato_id": contato.id,
                "nome": contato.nome,
                "email": email,
                "telefone": telefone,
                "foto": contato.foto,
                "relacao": relacao
            })

        return {"status": 200, "contatos": contatos}
    finally:
        db.close()


@router.put("/exlcuirContato")
def excluir_contato(data: dict = Body(...)):
    vendedor_id = data.get("vendedor_id");
    contato_id = data.get("contato_id");
    db = SessionLocal(); 

    try:
        deletar = db.query(VendedorContato).filter(
            VendedorContato.id_vendedor == vendedor_id,
            VendedorContato.id_contato == contato_id
        ).delete()

        if deletar == 0:
            raise HTTPException(status_code=404, detail="Associação não encontrada")

        db.commit()
        return {"status": 200, "mensagem": "Contato desvinculado com sucesso"}
    
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Erro de integridade no banco de dados")
    
    finally:
        db.close()