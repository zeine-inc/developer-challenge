from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import timedelta
import uuid

from app.core.database import get_db
from app.core.security import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    create_refresh_token,
    get_current_user,
    validate_password_strength,
    validate_email_format
)
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import (
    UserLogin, 
    UserRegister, 
    TokenResponse, 
    RefreshTokenRequest,
    UserProfile,
    UserProfileUpdate,
    ChangePasswordRequest
)

router = APIRouter()
security = HTTPBearer()


@router.post("/login", response_model=TokenResponse, summary="Fazer login")
async def login(
    user_data: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """
    Autenticar usuário com email e senha.
    
    Retorna tokens de acesso e refresh para autenticação.
    """
    # Buscar usuário por email
    result = await db.execute(select(User).where(User.email == user_data.email.lower()))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    # Verificar senha
    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    # Verificar se usuário está ativo
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Conta desativada"
        )
    
    # Criar tokens
    token_data = {
        "sub": str(user.id),
        "email": user.email
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user.to_dict()
    )


@router.post("/register", response_model=TokenResponse, summary="Registrar novo usuário")
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """
    Registrar novo usuário no sistema.
    
    Cria uma nova conta e retorna tokens de autenticação.
    """
    # Verificar se email já existe
    result = await db.execute(select(User).where(User.email == user_data.email.lower()))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já está em uso"
        )
    
    # Validar força da senha
    if not validate_password_strength(user_data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais"
        )
    
    # Criar novo usuário
    hashed_password = get_password_hash(user_data.password)
    
    new_user = User(
        email=user_data.email.lower(),
        password_hash=hashed_password,
        full_name=user_data.full_name,
        phone=user_data.phone,
        is_active=True,
        is_verified=True  # Para MVP, considerar usuários como verificados
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Criar tokens
    token_data = {
        "sub": str(new_user.id),
        "email": new_user.email
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=new_user.to_dict()
    )


@router.post("/refresh", response_model=TokenResponse, summary="Renovar token de acesso")
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Renovar token de acesso usando refresh token.
    
    Útil quando o access token expira.
    """
    from app.core.security import verify_token
    
    # Verificar refresh token
    payload = verify_token(refresh_data.refresh_token)
    
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido ou expirado"
        )
    
    # Buscar usuário
    user_id = payload.get("sub")
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado ou inativo"
        )
    
    # Criar novos tokens
    token_data = {
        "sub": str(user.id),
        "email": user.email
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user.to_dict()
    )


@router.get("/me", response_model=UserProfile, summary="Obter perfil do usuário atual")
async def get_current_user_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Obter dados do perfil do usuário autenticado.
    """
    result = await db.execute(select(User).where(User.id == uuid.UUID(current_user["user_id"])))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    return user


@router.put("/me", response_model=UserProfile, summary="Atualizar perfil do usuário")
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Atualizar dados do perfil do usuário autenticado.
    """
    result = await db.execute(select(User).where(User.id == uuid.UUID(current_user["user_id"])))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Atualizar campos fornecidos
    update_data = profile_data.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        if value is not None:
            setattr(user, field, value)
    
    await db.commit()
    await db.refresh(user)
    
    return user


@router.post("/change-password", summary="Alterar senha")
async def change_password(
    password_data: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Alterar senha do usuário autenticado.
    """
    result = await db.execute(select(User).where(User.id == uuid.UUID(current_user["user_id"])))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Verificar senha atual
    if not verify_password(password_data.current_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Senha atual incorreta"
        )
    
    # Validar nova senha
    if not validate_password_strength(password_data.new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nova senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais"
        )
    
    # Atualizar senha
    user.password_hash = get_password_hash(password_data.new_password)
    await db.commit()
    
    return {"message": "Senha alterada com sucesso"}


@router.post("/logout", summary="Fazer logout")
async def logout():
    """
    Fazer logout do usuário.
    
    Nota: Em uma implementação mais robusta, você pode invalidar tokens no servidor.
    """
    return {"message": "Logout realizado com sucesso"}


# Endpoint para verificar se token é válido
@router.get("/verify", summary="Verificar token")
async def verify_token_endpoint(current_user: dict = Depends(get_current_user)):
    """
    Verificar se o token de acesso é válido.
    """
    return {
        "valid": True,
        "user_id": current_user["user_id"],
        "email": current_user["email"]
    }
