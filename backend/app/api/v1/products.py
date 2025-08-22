from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload
from typing import List, Optional
import uuid
from decimal import Decimal

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.product import Product, ProductStatus
from app.models.user import User
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
    ProductFilter,
    ProductStats,
    ProductStatusUpdate,
    ProductBulkAction
)

router = APIRouter()


@router.post("/", response_model=ProductResponse, summary="Criar novo produto")
async def create_product(
    product_data: ProductCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Criar um novo produto para o usuário autenticado.
    """
    # Criar novo produto
    new_product = Product(
        user_id=uuid.UUID(current_user["user_id"]),
        title=product_data.title,
        description=product_data.description,
        price=product_data.price,
        image_url=product_data.image_url,
        category=product_data.category,
        status=product_data.status,
        tags=product_data.tags
    )
    
    db.add(new_product)
    await db.commit()
    await db.refresh(new_product)
    
    # Carregar dados do usuário
    await db.refresh(new_product)
    
    return new_product


@router.get("/", response_model=ProductListResponse, summary="Listar produtos")
async def list_products(
    search: Optional[str] = Query(None, description="Termo de busca"),
    status: Optional[ProductStatus] = Query(None, description="Status do produto"),
    category: Optional[str] = Query(None, description="Categoria do produto"),
    min_price: Optional[Decimal] = Query(None, ge=0, description="Preço mínimo"),
    max_price: Optional[Decimal] = Query(None, ge=0, description="Preço máximo"),
    sort_by: str = Query("created_at", description="Campo para ordenação"),
    sort_order: str = Query("desc", description="Ordem da ordenação (asc/desc)"),
    page: int = Query(1, ge=1, description="Número da página"),
    limit: int = Query(20, ge=1, le=100, description="Limite por página"),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Listar produtos do usuário autenticado com filtros e paginação.
    """
    # Construir query base
    query = select(Product).where(Product.user_id == uuid.UUID(current_user["user_id"]))
    
    # Aplicar filtros
    if search:
        search_filter = or_(
            Product.title.ilike(f"%{search}%"),
            Product.description.ilike(f"%{search}%"),
            Product.category.ilike(f"%{search}%")
        )
        query = query.where(search_filter)
    
    if status:
        query = query.where(Product.status == status)
    
    if category:
        query = query.where(Product.category == category)
    
    if min_price is not None:
        query = query.where(Product.price >= min_price)
    
    if max_price is not None:
        query = query.where(Product.price <= max_price)
    
    # Contar total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Aplicar ordenação
    if sort_order.lower() == "asc":
        query = query.order_by(getattr(Product, sort_by).asc())
    else:
        query = query.order_by(getattr(Product, sort_by).desc())
    
    # Aplicar paginação
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)
    
    # Executar query
    result = await db.execute(query)
    products = result.scalars().all()
    
    # Calcular páginas
    pages = (total + limit - 1) // limit
    
    return ProductListResponse(
        products=[product.to_dict() for product in products],
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )


@router.get("/{product_id}", response_model=ProductResponse, summary="Obter produto específico")
async def get_product(
    product_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Obter detalhes de um produto específico.
    """
    try:
        product_uuid = uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID do produto inválido"
        )
    
    result = await db.execute(
        select(Product).where(
            and_(
                Product.id == product_uuid,
                Product.user_id == uuid.UUID(current_user["user_id"])
            )
        )
    )
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    
    # Incrementar contador de visualizações
    product.increment_views()
    await db.commit()
    
    return product


@router.put("/{product_id}", response_model=ProductResponse, summary="Atualizar produto")
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Atualizar um produto existente.
    """
    try:
        product_uuid = uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID do produto inválido"
        )
    
    result = await db.execute(
        select(Product).where(
            and_(
                Product.id == product_uuid,
                Product.user_id == uuid.UUID(current_user["user_id"])
            )
        )
    )
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    
    # Verificar se pode editar
    if not product.can_edit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Produto não pode ser editado no status atual"
        )
    
    # Atualizar campos fornecidos
    update_data = product_data.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        if value is not None:
            setattr(product, field, value)
    
    await db.commit()
    await db.refresh(product)
    
    return product


@router.delete("/{product_id}", summary="Excluir produto")
async def delete_product(
    product_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Excluir um produto.
    """
    try:
        product_uuid = uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID do produto inválido"
        )
    
    result = await db.execute(
        select(Product).where(
            and_(
                Product.id == product_uuid,
                Product.user_id == uuid.UUID(current_user["user_id"])
            )
        )
    )
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    
    await db.delete(product)
    await db.commit()
    
    return {"message": "Produto excluído com sucesso"}


@router.patch("/{product_id}/status", response_model=ProductResponse, summary="Atualizar status do produto")
async def update_product_status(
    product_id: str,
    status_data: ProductStatusUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Atualizar status de um produto.
    """
    try:
        product_uuid = uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID do produto inválido"
        )
    
    result = await db.execute(
        select(Product).where(
            and_(
                Product.id == product_uuid,
                Product.user_id == uuid.UUID(current_user["user_id"])
            )
        )
    )
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    
    # Atualizar status
    product.status = status_data.status
    await db.commit()
    await db.refresh(product)
    
    return product


@router.get("/stats/summary", response_model=ProductStats, summary="Obter estatísticas dos produtos")
async def get_product_stats(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Obter estatísticas dos produtos do usuário.
    """
    user_id = uuid.UUID(current_user["user_id"])
    
    # Contar produtos por status
    total_result = await db.execute(
        select(func.count()).where(Product.user_id == user_id)
    )
    total_products = total_result.scalar()
    
    active_result = await db.execute(
        select(func.count()).where(
            and_(Product.user_id == user_id, Product.status == ProductStatus.ACTIVE)
        )
    )
    active_products = active_result.scalar()
    
    sold_result = await db.execute(
        select(func.count()).where(
            and_(Product.user_id == user_id, Product.status == ProductStatus.SOLD)
        )
    )
    sold_products = sold_result.scalar()
    
    draft_result = await db.execute(
        select(func.count()).where(
            and_(Product.user_id == user_id, Product.status == ProductStatus.DRAFT)
        )
    )
    draft_products = draft_result.scalar()
    
    # Somar visualizações e curtidas
    views_result = await db.execute(
        select(func.sum(Product.views_count)).where(Product.user_id == user_id)
    )
    total_views = views_result.scalar() or 0
    
    likes_result = await db.execute(
        select(func.sum(Product.likes_count)).where(Product.user_id == user_id)
    )
    total_likes = likes_result.scalar() or 0
    
    # Somar valor total
    value_result = await db.execute(
        select(func.sum(Product.price)).where(
            and_(Product.user_id == user_id, Product.status == ProductStatus.ACTIVE)
        )
    )
    total_value = value_result.scalar() or Decimal('0.00')
    
    return ProductStats(
        total_products=total_products,
        active_products=active_products,
        sold_products=sold_products,
        draft_products=draft_products,
        total_views=total_views,
        total_likes=total_likes,
        total_value=total_value
    )


@router.post("/bulk/actions", summary="Ações em lote")
async def bulk_actions(
    bulk_data: ProductBulkAction,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Executar ações em lote nos produtos.
    """
    user_id = uuid.UUID(current_user["user_id"])
    
    # Validar IDs
    product_uuids = []
    for product_id in bulk_data.product_ids:
        try:
            product_uuids.append(uuid.UUID(product_id))
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"ID inválido: {product_id}"
            )
    
    # Buscar produtos
    result = await db.execute(
        select(Product).where(
            and_(
                Product.id.in_(product_uuids),
                Product.user_id == user_id
            )
        )
    )
    products = result.scalars().all()
    
    if len(products) != len(product_uuids):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alguns produtos não foram encontrados"
        )
    
    # Executar ação
    updated_count = 0
    for product in products:
        if bulk_data.action == "activate":
            product.status = ProductStatus.ACTIVE
            updated_count += 1
        elif bulk_data.action == "deactivate":
            product.status = ProductStatus.INACTIVE
            updated_count += 1
        elif bulk_data.action == "mark_sold":
            product.status = ProductStatus.SOLD
            updated_count += 1
        elif bulk_data.action == "delete":
            await db.delete(product)
            updated_count += 1
    
    await db.commit()
    
    return {
        "message": f"Ação '{bulk_data.action}' executada em {updated_count} produtos",
        "updated_count": updated_count
    }


@router.get("/categories/list", summary="Listar categorias")
async def list_categories(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Listar todas as categorias dos produtos do usuário.
    """
    result = await db.execute(
        select(Product.category)
        .where(
            and_(
                Product.user_id == uuid.UUID(current_user["user_id"]),
                Product.category.isnot(None)
            )
        )
        .distinct()
    )
    categories = result.scalars().all()
    
    return {"categories": [cat for cat in categories if cat]}
