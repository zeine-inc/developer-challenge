import { useQuery } from '@tanstack/react-query';
// Ajuste o caminho conforme necessário; exemplo de caminho relativo:
// Ajuste o caminho conforme necessário; exemplo de caminho relativo:
// Try the relative path if alias is not configured:
import {
  usersAPI,
  DashboardData,
  TopProduct,
  DashboardStats,
} from '@/services/usersAPI';

export default function DashboardPage() {
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => usersAPI.getDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  if (isLoading) {
    // ... (código de loading permanece o mesmo)
  }

  if (error) {
    // ... (código de erro permanece o mesmo)
  }

  // Defina o tipo do fallback explicitamente
  const stats: DashboardStats = dashboardData?.stats || {
    totalProducts: 0,
    activeProducts: 0,
    soldProducts: 0,
    recentProducts: 0,
    totalViews: 0,
    totalValue: 0,
  };

  const topProducts: TopProduct[] = dashboardData?.topProducts || [];

  return (
    <div className="space-y-6">
      {/* ... (resto do JSX permanece o mesmo) */}
    </div>
  );
}
