// src/services/usersAPI.ts
import axios from 'axios'; // Ou outra biblioteca HTTP que você usa

// Defina a URL base da API (ajuste conforme seu backend)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Interface para os dados retornados pela API
export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  soldProducts: number;
  recentProducts: number;
  totalViews: number;
  totalValue: number;
}

export interface TopProduct {
  id: string | number;
  name: string;
  price: number;
  viewsCount: number;
  status: string;
}

export interface DashboardData {
  stats: DashboardStats;
  topProducts: TopProduct[];
}

// Cliente da API
export const usersAPI = {
  getDashboard: async (): Promise<DashboardData> => {
    try {
      const response = await axios.get<DashboardData>(`${API_URL}/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error; // Lança o erro para ser tratado pelo useQuery
    }
  },
};
