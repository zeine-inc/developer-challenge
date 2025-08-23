import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Interface para o produto
export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  tags?: string;
  status: 'draft' | 'active' | 'inactive' | 'sold';
  imageUrl?: string;
}

export const productsAPI = {
  // Listar produtos
  list: async (params?: any) => {
    const response = await axios.get<Product[]>(`${API_URL}/products`, {
      params,
    });
    return response.data;
  },

  // Obter produto por ID
  get: async (id: string) => {
    const response = await axios.get<Product>(`${API_URL}/products/${id}`);
    return response.data;
  },

  // Obter produto por ID (alternativo, para consistência com page.tsx)
  getProduct: async (id: string) => {
    const response = await axios.get<Product>(`${API_URL}/products/${id}`);
    return response.data;
  },

  // Criar novo produto
  create: async (data: any) => {
    const response = await axios.post<Product>(`${API_URL}/products`, data);
    return response.data;
  },

  // Atualizar produto
  update: async (id: string, data: any) => {
    const response = await axios.put<Product>(
      `${API_URL}/products/${id}`,
      data
    );
    return response.data;
  },

  // Ações em massa
  bulkActions: async (data: { ids: string[]; action: string }) => {
    const response = await axios.post(`${API_URL}/products/bulk`, data);
    return response.data;
  },
};
