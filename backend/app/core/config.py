from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    """Configurações da aplicação usando Pydantic Settings"""
    
    # Configurações básicas
    APP_NAME: str = "Marketplace API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "postgresql://admin:secret123@localhost:5432/marketplace"
    
    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://frontend:3000"
    ]
    
    # Cloudinary (Upload de imagens)
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None
    
    # Redis (Cache)
    REDIS_URL: Optional[str] = "redis://localhost:6379"
    
    # Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]
    
    # Paginação
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Instância global das configurações
settings = Settings()


# Validações de configuração
def validate_settings():
    """Validar configurações críticas"""
    if not settings.SECRET_KEY or settings.SECRET_KEY == "your-super-secret-key-change-in-production":
        raise ValueError("SECRET_KEY deve ser configurada em produção!")
    
    if not settings.DATABASE_URL:
        raise ValueError("DATABASE_URL é obrigatória!")
    
    # Validar configurações do Cloudinary se for usar upload
    if any([settings.CLOUDINARY_CLOUD_NAME, settings.CLOUDINARY_API_KEY, settings.CLOUDINARY_API_SECRET]):
        if not all([settings.CLOUDINARY_CLOUD_NAME, settings.CLOUDINARY_API_KEY, settings.CLOUDINARY_API_SECRET]):
            raise ValueError("Todas as configurações do Cloudinary são obrigatórias!")


# Executar validação na importação
if not settings.DEBUG:
    validate_settings()
