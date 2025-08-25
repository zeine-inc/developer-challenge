from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime

from app.core.security import validate_password_strength, validate_email_format


class UserLogin(BaseModel):
    """Schema para login do usuário"""
    email: EmailStr = Field(..., description="Email do usuário")
    password: str = Field(..., min_length=1, description="Senha do usuário")
    
    @validator('email')
    def validate_email(cls, v):
        if not validate_email_format(v):
            raise ValueError('Formato de email inválido')
        return v.lower()


class UserRegister(BaseModel):
    """Schema para registro de usuário"""
    email: EmailStr = Field(..., description="Email do usuário")
    password: str = Field(..., min_length=8, description="Senha do usuário")
    full_name: str = Field(..., min_length=2, max_length=255, description="Nome completo")
    phone: Optional[str] = Field(None, max_length=20, description="Telefone")
    
    @validator('email')
    def validate_email(cls, v):
        if not validate_email_format(v):
            raise ValueError('Formato de email inválido')
        return v.lower()
    
    @validator('password')
    def validate_password(cls, v):
        if not validate_password_strength(v):
            raise ValueError(
                'A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, '
                'minúsculas, números e caracteres especiais'
            )
        return v
    
    @validator('full_name')
    def validate_full_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Nome deve ter pelo menos 2 caracteres')
        return v.strip()


class TokenResponse(BaseModel):
    """Schema para resposta de token"""
    access_token: str = Field(..., description="Token de acesso")
    refresh_token: str = Field(..., description="Token de refresh")
    token_type: str = Field(default="bearer", description="Tipo do token")
    expires_in: int = Field(..., description="Tempo de expiração em segundos")
    user: dict = Field(..., description="Dados do usuário")


class RefreshTokenRequest(BaseModel):
    """Schema para refresh de token"""
    refresh_token: str = Field(..., description="Token de refresh")


class PasswordResetRequest(BaseModel):
    """Schema para solicitação de reset de senha"""
    email: EmailStr = Field(..., description="Email do usuário")
    
    @validator('email')
    def validate_email(cls, v):
        if not validate_email_format(v):
            raise ValueError('Formato de email inválido')
        return v.lower()


class PasswordResetConfirm(BaseModel):
    """Schema para confirmação de reset de senha"""
    token: str = Field(..., description="Token de reset")
    new_password: str = Field(..., min_length=8, description="Nova senha")
    
    @validator('new_password')
    def validate_password(cls, v):
        if not validate_password_strength(v):
            raise ValueError(
                'A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, '
                'minúsculas, números e caracteres especiais'
            )
        return v


class UserProfile(BaseModel):
    """Schema para perfil do usuário"""
    id: str = Field(..., description="ID do usuário")
    email: str = Field(..., description="Email do usuário")
    full_name: Optional[str] = Field(None, description="Nome completo")
    phone: Optional[str] = Field(None, description="Telefone")
    is_active: bool = Field(..., description="Status ativo")
    is_verified: bool = Field(..., description="Status verificado")
    avatar_url: Optional[str] = Field(None, description="URL do avatar")
    bio: Optional[str] = Field(None, description="Biografia")
    created_at: datetime = Field(..., description="Data de criação")
    updated_at: datetime = Field(..., description="Data de atualização")
    
    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    """Schema para atualização de perfil"""
    full_name: Optional[str] = Field(None, min_length=2, max_length=255, description="Nome completo")
    phone: Optional[str] = Field(None, max_length=20, description="Telefone")
    bio: Optional[str] = Field(None, max_length=500, description="Biografia")
    
    @validator('full_name')
    def validate_full_name(cls, v):
        if v is not None and len(v.strip()) < 2:
            raise ValueError('Nome deve ter pelo menos 2 caracteres')
        return v.strip() if v else v


class ChangePasswordRequest(BaseModel):
    """Schema para alteração de senha"""
    current_password: str = Field(..., description="Senha atual")
    new_password: str = Field(..., min_length=8, description="Nova senha")
    
    @validator('new_password')
    def validate_password(cls, v):
        if not validate_password_strength(v):
            raise ValueError(
                'A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, '
                'minúsculas, números e caracteres especiais'
            )
        return v
