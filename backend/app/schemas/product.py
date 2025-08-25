from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

from app.models.product import ProductStatus


class ProductBase(BaseModel):
    """Schema base para produto"""
    title: str = Field(..., min_length=1, max_length=255, description="Título do produto")
    description: Optional[str] = Field(None, max_length=2000, description="Descrição do produto")
    price: Decimal = Field(..., ge=0, decimal_places=2, description="Preço do produto")
    category: Optional[str] = Field(None, max_length=100, description="Categoria do produto")
    tags: Optional[str] = Field(None, description="Tags do produto (JSON string)")
    
    @validator('title')
    def validate_title(cls, v):
        if not v.strip():
            raise ValueError('Título não pode estar vazio')
        return v.strip()
    
    @validator('price')
    def validate_price(cls, v):
        if v <= 0:
            raise ValueError('Preço deve ser maior que zero')
        return v


class ProductCreate(ProductBase):
    """Schema para criação de produto"""
    image_url: Optional[str] = Field(None, max_length=500, description="URL da imagem do produto")
    status: ProductStatus = Field(default=ProductStatus.DRAFT, description="Status do produto")


class ProductUpdate(BaseModel):
    """Schema para atualização de produto"""
    title: Optional[str] = Field(None, min_length=1, max_length=255, description="Título do produto")
    description: Optional[str] = Field(None, max_length=2000, description="Descrição do produto")
    price: Optional[Decimal] = Field(None, ge=0, decimal_places=2, description="Preço do produto")
    image_url: Optional[str] = Field(None, max_length=500, description="URL da imagem do produto")
    category: Optional[str] = Field(None, max_length=100, description="Categoria do produto")
    status: Optional[ProductStatus] = Field(None, description="Status do produto")
    tags: Optional[str] = Field(None, description="Tags do produto (JSON string)")
    
    @validator('title')
    def validate_title(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Título não pode estar vazio')
        return v.strip() if v else v
    
    @validator('price')
    def validate_price(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Preço deve ser maior que zero')
        return v


class ProductResponse(ProductBase):
    """Schema para resposta de produto"""
    id: str = Field(..., description="ID do produto")
    user_id: str = Field(..., description="ID do usuário proprietário")
    image_url: Optional[str] = Field(None, description="URL da imagem do produto")
    status: str = Field(..., description="Status do produto")
    views_count: int = Field(..., description="Contador de visualizações")
    likes_count: int = Field(..., description="Contador de curtidas")
    created_at: datetime = Field(..., description="Data de criação")
    updated_at: datetime = Field(..., description="Data de atualização")
    user: Optional[dict] = Field(None, description="Dados do usuário proprietário")
    
    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    """Schema para resposta de listagem de produtos"""
    products: List[ProductResponse] = Field(..., description="Lista de produtos")
    total: int = Field(..., description="Total de produtos")
    page: int = Field(..., description="Página atual")
    limit: int = Field(..., description="Limite por página")
    pages: int = Field(..., description="Total de páginas")


class ProductFilter(BaseModel):
    """Schema para filtros de produto"""
    search: Optional[str] = Field(None, description="Termo de busca")
    status: Optional[ProductStatus] = Field(None, description="Status do produto")
    category: Optional[str] = Field(None, description="Categoria do produto")
    min_price: Optional[Decimal] = Field(None, ge=0, description="Preço mínimo")
    max_price: Optional[Decimal] = Field(None, ge=0, description="Preço máximo")
    sort_by: Optional[str] = Field(default="created_at", description="Campo para ordenação")
    sort_order: Optional[str] = Field(default="desc", description="Ordem da ordenação (asc/desc)")
    page: int = Field(default=1, ge=1, description="Número da página")
    limit: int = Field(default=20, ge=1, le=100, description="Limite por página")
    
    @validator('sort_by')
    def validate_sort_by(cls, v):
        allowed_fields = ['title', 'price', 'created_at', 'updated_at', 'views_count', 'likes_count']
        if v not in allowed_fields:
            raise ValueError(f'Campo de ordenação deve ser um dos: {", ".join(allowed_fields)}')
        return v
    
    @validator('sort_order')
    def validate_sort_order(cls, v):
        if v not in ['asc', 'desc']:
            raise ValueError('Ordem de ordenação deve ser "asc" ou "desc"')
        return v
    
    @validator('min_price', 'max_price')
    def validate_price_range(cls, v, values):
        if v is not None and 'max_price' in values and values['max_price'] is not None:
            if v > values['max_price']:
                raise ValueError('Preço mínimo não pode ser maior que preço máximo')
        return v


class ProductStats(BaseModel):
    """Schema para estatísticas de produtos"""
    total_products: int = Field(..., description="Total de produtos")
    active_products: int = Field(..., description="Produtos ativos")
    sold_products: int = Field(..., description="Produtos vendidos")
    draft_products: int = Field(..., description="Produtos em rascunho")
    total_views: int = Field(..., description="Total de visualizações")
    total_likes: int = Field(..., description="Total de curtidas")
    total_value: Decimal = Field(..., description="Valor total dos produtos")


class ProductImageUpload(BaseModel):
    """Schema para upload de imagem"""
    image_url: str = Field(..., description="URL da imagem enviada")


class ProductStatusUpdate(BaseModel):
    """Schema para atualização de status"""
    status: ProductStatus = Field(..., description="Novo status do produto")


class ProductBulkAction(BaseModel):
    """Schema para ações em lote"""
    product_ids: List[str] = Field(..., min_items=1, description="IDs dos produtos")
    action: str = Field(..., description="Ação a ser executada")
    
    @validator('action')
    def validate_action(cls, v):
        allowed_actions = ['activate', 'deactivate', 'delete', 'mark_sold']
        if v not in allowed_actions:
            raise ValueError(f'Ação deve ser uma das: {", ".join(allowed_actions)}')
        return v
