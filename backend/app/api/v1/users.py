from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.auth import UserProfile, UserProfileUpdate

router = APIRouter()


@router.get("/profile", response_model=UserProfile, summary="Obter perfil do usuário")
async def get_user_profile(
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


@router.put("/profile", response_model=UserProfile, summary="Atualizar perfil do usuário")
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


@router.get("/dashboard", summary="Obter dados do dashboard")
async def get_dashboard_data(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Obter dados para o dashboard do usuário.
    """
    from app.models.product import Product, ProductStatus
    from sqlalchemy import func
    from datetime import datetime, timedelta
    
    user_id = uuid.UUID(current_user["user_id"])
    
    # Estatísticas básicas
    total_products = await db.execute(
        select(func.count()).where(Product.user_id == user_id)
    )
    total_products = total_products.scalar()
    
    active_products = await db.execute(
        select(func.count()).where(
            Product.user_id == user_id,
            Product.status == ProductStatus.ACTIVE
        )
    )
    active_products = active_products.scalar()
    
    sold_products = await db.execute(
        select(func.count()).where(
            Product.user_id == user_id,
            Product.status == ProductStatus.SOLD
        )
    )
    sold_products = sold_products.scalar()
    
    # Produtos dos últimos 30 dias
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_products = await db.execute(
        select(func.count()).where(
            Product.user_id == user_id,
            Product.created_at >= thirty_days_ago
        )
    )
    recent_products = recent_products.scalar()
    
    # Total de visualizações
    total_views = await db.execute(
        select(func.sum(Product.views_count)).where(Product.user_id == user_id)
    )
    total_views = total_views.scalar() or 0
    
    # Valor total dos produtos ativos
    total_value = await db.execute(
        select(func.sum(Product.price)).where(
            Product.user_id == user_id,
            Product.status == ProductStatus.ACTIVE
        )
    )
    total_value = total_value.scalar() or 0
    
    # Produtos mais visualizados (top 5)
    top_products = await db.execute(
        select(Product)
        .where(Product.user_id == user_id)
        .order_by(Product.views_count.desc())
        .limit(5)
    )
    top_products = top_products.scalars().all()
    
    return {
        "stats": {
            "total_products": total_products,
            "active_products": active_products,
            "sold_products": sold_products,
            "recent_products": recent_products,
            "total_views": total_views,
            "total_value": float(total_value)
        },
        "top_products": [
            {
                "id": str(p.id),
                "title": p.title,
                "price": float(p.price),
                "views_count": p.views_count,
                "status": p.status.value
            }
            for p in top_products
        ]
    }
