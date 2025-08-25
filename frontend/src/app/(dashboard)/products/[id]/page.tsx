'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  DollarSign,
  Package,
  TrendingUp,
  Heart,
} from 'lucide-react';

import { productsAPI, formatPrice, formatDate } from '@/lib/api';

interface Product {
  id: string;
  title: string;
  status: string;
  imageUrl: string | null;
  viewsCount: number;
  likesCount: number;
  price: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string;
  description?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  // Buscar dados do produto
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => productsAPI.get(productId) as Promise<Product>,
    enabled: !!productId,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'draft':
        return 'Rascunho';
      case 'sold':
        return 'Vendido';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Produto não encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Link
            href="/products"
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos produtos</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/products"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {product.title}
            </h1>
            <p className="text-gray-600 mt-1">Detalhes do produto</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(product.status)}`}
          >
            {getStatusLabel(product.status)}
          </span>

          <Link
            href={`/products/${product.id}/edit`}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagem do produto */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {product.viewsCount}
              </p>
              <p className="text-sm text-gray-600">Visualizações</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {product.likesCount}
              </p>
              <p className="text-sm text-gray-600">Curtidas</p>
            </div>
          </div>
        </div>

        {/* Informações do produto */}
        <div className="space-y-6">
          {/* Preço */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Preço</span>
            </div>
            <p className="text-3xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Informações básicas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Categoria</span>
                <span className="text-sm font-medium text-gray-900">
                  {product.category || 'Não informada'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}
                >
                  {getStatusLabel(product.status)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Criado em</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(product.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Última atualização
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(product.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {product.tags && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Descrição */}
          {product.description && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Descrição
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>

        <div className="flex items-center space-x-4">
          <Link
            href={`/products/${product.id}/edit`}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Editar produto</span>
          </Link>

          <button
            onClick={() => {
              if (confirm('Tem certeza que deseja excluir este produto?')) {
                // Implementar exclusão
                console.log('Excluir produto:', product.id);
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
