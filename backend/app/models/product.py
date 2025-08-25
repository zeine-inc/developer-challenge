from sqlalchemy import Column, String, Integer, Numeric, DateTime, Text, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.core.database import Base


class ProductStatus(str, enum.Enum):
    """Status do produto"""
    DRAFT = "draft"
    ACTIVE = "active"
    INACTIVE = "inactive"
    SOLD = "sold"


class Product(Base):
    """Modelo de produto"""
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    image_url = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True, index=True)
    status = Column(Enum(ProductStatus), default=ProductStatus.DRAFT, nullable=False, index=True)
    views_count = Column(Integer, default=0, nullable=False)
    likes_count = Column(Integer, default=0, nullable=False)
    tags = Column(Text, nullable=True)  # JSON string de tags
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relacionamentos
    user = relationship("User", back_populates="products")
    
    def __repr__(self):
        return f"<Product(id={self.id}, title='{self.title}', price={self.price}, status='{self.status}')>"
    
    def to_dict(self):
        """Converter para dicionário"""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "title": self.title,
            "description": self.description,
            "price": float(self.price) if self.price else 0.0,
            "image_url": self.image_url,
            "category": self.category,
            "status": self.status.value,
            "views_count": self.views_count,
            "likes_count": self.likes_count,
            "tags": self.tags,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "user": {
                "id": str(self.user.id),
                "full_name": self.user.full_name,
                "email": self.user.email
            } if self.user else None
        }
    
    def increment_views(self):
        """Incrementar contador de visualizações"""
        self.views_count += 1
    
    def increment_likes(self):
        """Incrementar contador de curtidas"""
        self.likes_count += 1
    
    def is_available(self) -> bool:
        """Verificar se o produto está disponível para compra"""
        return self.status == ProductStatus.ACTIVE
    
    def can_edit(self) -> bool:
        """Verificar se o produto pode ser editado"""
        return self.status in [ProductStatus.DRAFT, ProductStatus.ACTIVE, ProductStatus.INACTIVE]
    
    def get_status_display(self) -> str:
        """Obter texto de exibição do status"""
        status_map = {
            ProductStatus.DRAFT: "Rascunho",
            ProductStatus.ACTIVE: "Ativo",
            ProductStatus.INACTIVE: "Inativo",
            ProductStatus.SOLD: "Vendido"
        }
        return status_map.get(self.status, self.status.value)
    
    def get_status_color(self) -> str:
        """Obter cor do status para UI"""
        color_map = {
            ProductStatus.DRAFT: "gray",
            ProductStatus.ACTIVE: "green",
            ProductStatus.INACTIVE: "yellow",
            ProductStatus.SOLD: "blue"
        }
        return color_map.get(self.status, "gray")


# Adicionar relacionamento no modelo User
from app.models.user import User
User.products = relationship("Product", back_populates="user", cascade="all, delete-orphan")
