'use client';

import { useQuery } from '@tanstack/react-query';
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
  }

  if (error) {
    console.error('Error fetching dashboard data:', error);
  }

  const stats: DashboardStats = dashboardData?.stats || {
    totalProducts: 0,
    activeProducts: 0,
    soldProducts: 0,
    recentProducts: 0,
    totalViews: 0,
    totalValue: 0,
  };

  const topProducts: TopProduct[] = dashboardData?.topProducts || [];

  return <div className="space-y-6">{}</div>;
}
