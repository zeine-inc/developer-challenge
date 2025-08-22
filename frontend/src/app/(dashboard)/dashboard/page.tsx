'use client';

import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign,
  Calendar,
  Eye,
  ShoppingCart
} from 'lucide-react';

import { usersAPI, formatPrice } from '@/lib/api';

// Componente de card de estatística
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary',
  change 
}: {
  title: string;
  value: string | number;
  icon: any;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
  change?: string;
}) {
  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover-lift">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Componente de gráfico de visitantes
function VisitorsChart({ data }: { data: any[] }) {
  // Simular dados de visitantes dos últimos 30 dias
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    visitors: Math.floor(Math.random() * 50) + 50, // 50-100 visitantes por dia
  }));

  const maxVisitors = Math.max(...chartData.map(d => d.visitors));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Visitantes</h3>
          <p className="text-sm text-gray-600">Últimos 30 dias</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>25 DE JUNHO - 25 DE JULHO</span>
        </div>
      </div>

      {/* Gráfico simples */}
      <div className="h-64 flex items-end space-x-1">
        {chartData.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-secondary-500 rounded-t transition-all duration-300 hover:bg-secondary-600"
              style={{ 
                height: `${(day.visitors / maxVisitors) * 100}%`,
                minHeight: '4px'
              }}
            ></div>
            <span className="text-xs text-gray-500 mt-1">{day.date}</span>
          </div>
        ))}
      </div>

      {/* Tooltip de exemplo */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">08 DE JULHO</span>
          <span className="font-medium">138 visitantes</span>
        </div>
      </div>
    </div>
  );
}

// Componente de produtos em destaque
function TopProducts({ products }: { products: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos em Destaque</h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{product.title}</p>
              <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{product.viewsCount} visualizações</p>
              <p className="text-xs text-gray-500 capitalize">{product.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // Buscar dados do dashboard
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => usersAPI.getDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-12 bg-gray-200 rounded w-12 ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Erro ao carregar dados do dashboard</p>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalProducts: 0,
    activeProducts: 0,
    soldProducts: 0,
    recentProducts: 0,
    totalViews: 0,
    totalValue: 0,
  };

  const topProducts = dashboardData?.topProducts || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Confira as estatísticas da sua loja no último mês</p>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Produtos vendidos"
          value={stats.soldProducts}
          icon={ShoppingCart}
          color="success"
          change="+12% este mês"
        />
        <StatCard
          title="Produtos anunciados"
          value={stats.activeProducts}
          icon={Package}
          color="primary"
        />
        <StatCard
          title="Pessoas visitantes"
          value={stats.totalViews.toLocaleString('pt-BR')}
          icon={Users}
          color="secondary"
        />
        <StatCard
          title="Valor total"
          value={formatPrice(stats.totalValue)}
          icon={DollarSign}
          color="warning"
        />
      </div>

      {/* Gráfico e produtos em destaque */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VisitorsChart data={[]} />
        </div>
        <div>
          <TopProducts products={topProducts} />
        </div>
      </div>

      {/* Resumo dos últimos 30 dias */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimos 30 dias</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{stats.recentProducts}</p>
            <p className="text-sm text-gray-600">Novos produtos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.soldProducts}</p>
            <p className="text-sm text-gray-600">Produtos vendidos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary-600">{stats.totalViews}</p>
            <p className="text-sm text-gray-600">Visualizações</p>
          </div>
        </div>
      </div>
    </div>
  );
}
