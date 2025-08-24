'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ShoppingCart,
  Package,
  Calendar,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

import { productsAPI, formatPrice, formatDate } from '@/lib/api';

// Componente de filtros
function ProductFilters({ 
  filters, 
  onFiltersChange 
}: {
  filters: any;
  onFiltersChange: (filters: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'draft', label: 'Rascunho' },
    { value: 'sold', label: 'Vendido' },
  ];

  const sortOptions = [
    { value: 'created_at:desc', label: 'Mais recentes' },
    { value: 'created_at:asc', label: 'Mais antigos' },
    { value: 'price:desc', label: 'Maior preço' },
    { value: 'price:asc', label: 'Menor preço' },
    { value: 'title:asc', label: 'Nome A-Z' },
    { value: 'title:desc', label: 'Nome Z-A' },
    { value: 'views_count:desc', label: 'Mais visualizados' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <Filter className="w-4 h-4" />
          <span>{isOpen ? 'Ocultar' : 'Mostrar'} filtros</span>
        </button>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <input
              type="text"
              placeholder="Digite a categoria"
              value={filters.category || ''}
              onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Preço mínimo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço mínimo
            </label>
            <input
              type="number"
              placeholder="R$ 0,00"
              value={filters.minPrice || ''}
              onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Preço máximo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço máximo
            </label>
            <input
              type="number"
              placeholder="R$ 0,00"
              value={filters.maxPrice || ''}
              onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Ordenação */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              value={filters.sortBy || 'created_at:desc'}
              onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Limpar filtros */}
          <div className="md:col-span-2 flex items-end">
            <button
              onClick={() => onFiltersChange({})}
              className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de card de produto
function ProductCard({ product, onStatusChange, onDelete }: {
  product: any;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'draft': return 'Rascunho';
      case 'sold': return 'Vendido';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover-lift">
      {/* Imagem do produto */}
      <div className="aspect-square bg-gray-100 relative">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
            {getStatusLabel(product.status)}
          </span>
        </div>

        {/* Menu de ações */}
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
              <Link
                href={`/products/${product.id}`}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Link>
              <Link
                href={`/products/${product.id}/edit`}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Link>
              <button
                onClick={() => onStatusChange(product.id, product.status === 'active' ? 'inactive' : 'active')}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {product.status === 'active' ? (
                  <EyeOff className="w-4 h-4 mr-2" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                {product.status === 'active' ? 'Desativar' : 'Ativar'}
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Informações do produto */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.title}</h3>
        <p className="text-lg font-bold text-primary-600 mb-2">{formatPrice(product.price)}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(product.createdAt)}
          </div>
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {product.viewsCount}
          </div>
        </div>

        {product.category && (
          <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">
            {product.category}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de paginação
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = useMemo(() => {
    const pagesArray = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pagesArray.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pagesArray.push(i);
        }
        pagesArray.push('...');
        pagesArray.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pagesArray.push(1);
        pagesArray.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pagesArray.push(i);
        }
      } else {
        pagesArray.push(1);
        pagesArray.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pagesArray.push(i);
        }
        pagesArray.push('...');
        pagesArray.push(totalPages);
      }
    }
    
    return pagesArray;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Página {currentPage} de {totalPages}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Anterior
        </button>
        
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-2 text-sm rounded-lg ${
              page === currentPage
                ? 'bg-primary-500 text-white'
                : page === '...'
                ? 'text-gray-400 cursor-default'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'created_at:desc',
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // Buscar produtos
  const { data: productsData, isLoading, error, refetch } = useQuery({
    queryKey: ['products', filters, currentPage, pageSize],
    queryFn: () => productsAPI.getProducts({
      ...filters,
      page: currentPage,
      limit: pageSize,
    }),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  const products = productsData?.products || [];
  const totalPages = Math.ceil((productsData?.total || 0) / pageSize);

  // Funções de ação
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await productsAPI.updateProductStatus(id, { status });
      refetch();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await productsAPI.deleteProduct(id);
        refetch();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset para primeira página
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 mt-1">Gerencie seus produtos anunciados</p>
        </div>
        
        <Link
          href="/products/new"
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo produto</span>
        </Link>
      </div>

      {/* Barra de busca */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Filtros */}
      <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Resultados */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {isLoading ? 'Carregando...' : `${productsData?.total || 0} produtos encontrados`}
          </h2>
        </div>

        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Erro ao carregar produtos</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-600 mb-6">
              {filters.search || Object.values(filters).some(v => v) 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro produto'
              }
            </p>
            {!filters.search && !Object.values(filters).some(v => v) && (
              <Link
                href="/products/new"
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Criar primeiro produto</span>
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Grid de produtos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
