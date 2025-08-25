from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import auth, products, users
from app.models import user, product  # Importar modelos para criar tabelas


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events da aplicação"""
    # Startup
    print("🚀 Iniciando Marketplace API...")
    
    # Criar tabelas se não existirem
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print("✅ Tabelas criadas/verificadas com sucesso!")
    print("📊 Database conectado e pronto!")
    
    yield
    
    # Shutdown
    print("🛑 Encerrando Marketplace API...")


# Criar instância do FastAPI
app = FastAPI(
    title="Marketplace API - Painel do Vendedor",
    description="API para o painel do vendedor do marketplace - Desafio Zeine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Autenticação"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Usuários"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Produtos"])


@app.get("/")
async def root():
    """Endpoint raiz da API"""
    return {
        "message": "🛍️ Marketplace API - Painel do Vendedor",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
        "company": "Zeine - Hub de Soluções Corporativas",
        "motto": "Tirar ideias do papel e transformá-las em produtos digitais completos"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": "2024-01-01T00:00:00Z",
        "service": "marketplace-api"
    }


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handler global para exceções HTTP"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "path": str(request.url)
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handler global para exceções gerais"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Erro interno do servidor",
            "detail": str(exc) if settings.DEBUG else "Algo deu errado",
            "status_code": 500,
            "path": str(request.url)
        }
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
