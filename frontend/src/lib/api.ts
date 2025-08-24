import { toast } from 'sonner';

// Configuração da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Classe para gerenciar requisições HTTP
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Método para obter token de autenticação
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  // Método para configurar headers da requisição
  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(customHeaders as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers as HeadersInit;
  }

  // Método para fazer requisições HTTP
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Verificar se a resposta é ok
      if (!response.ok) {
        // Tentar renovar token se for erro 401
        if (response.status === 401) {
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Tentar novamente com o novo token
            const newHeaders = this.getHeaders(options.headers);
            const retryConfig: RequestInit = {
              ...options,
              headers: newHeaders,
            };
            const retryResponse = await fetch(url, retryConfig);
            
            if (!retryResponse.ok) {
              throw new Error(`HTTP error! status: ${retryResponse.status}`);
            }
            
            return await retryResponse.json();
          } else {
            // Redirecionar para login se não conseguir renovar
            this.handleAuthError();
            throw new Error('Token expirado');
          }
        }

        // Tratar outros erros HTTP
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      // Verificar se a resposta tem conteúdo
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text() as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Método para renovar token
  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  }

  // Método para lidar com erro de autenticação
  private handleAuthError(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirecionar para login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Método para upload de arquivos
  async upload<T>(endpoint: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.getAuthToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${this.baseURL}${endpoint}`);
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }
}

// Instância global do cliente da API
export const apiClient = new ApiClient(API_BASE_URL);

// Funções auxiliares para endpoints específicos
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/api/v1/auth/login', credentials),
  
  register: (data: { email: string; password: string; full_name: string; phone?: string }) =>
    apiClient.post('/api/v1/auth/register', data),
  
  refresh: (refreshToken: string) =>
    apiClient.post('/api/v1/auth/refresh', { refresh_token: refreshToken }),
  
  logout: () =>
    apiClient.post('/api/v1/auth/logout'),
  
  verify: () =>
    apiClient.get('/api/v1/auth/verify'),
  
  getProfile: () =>
    apiClient.get('/api/v1/auth/me'),
  
  updateProfile: (data: any) =>
    apiClient.put('/api/v1/auth/me', data),
  
  changePassword: (data: { current_password: string; new_password: string }) =>
    apiClient.post('/api/v1/auth/change-password', data),
};

export const productsAPI = {
  list: (params?: any) =>
    apiClient.get('/api/v1/products', params),
  
  get: (id: string) =>
    apiClient.get(`/api/v1/products/${id}`),
  
  create: (data: any) =>
    apiClient.post('/api/v1/products', data),
  
  update: (id: string, data: any) =>
    apiClient.put(`/api/v1/products/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/api/v1/products/${id}`),
  
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/api/v1/products/${id}/status`, { status }),
  
  getStats: () =>
    apiClient.get('/api/v1/products/stats/summary'),
  
  getCategories: () =>
    apiClient.get('/api/v1/products/categories/list'),
  
  bulkActions: (data: { product_ids: string[]; action: string }) =>
    apiClient.post('/api/v1/products/bulk/actions', data),
  
  // Aliases para compatibilidade com o código existente
  getProducts: (params?: any) =>
    (productsAPI.list as any)(params),
  getProduct: (id: string) =>
    (productsAPI.get as any)(id),
  createProduct: (data: any) =>
    (productsAPI.create as any)(data),
  updateProductStatus: (id: string, data: { status: string }) =>
    (productsAPI.updateStatus as any)(id, data.status),
  deleteProduct: (id: string) =>
    (productsAPI.delete as any)(id),
};

export const usersAPI = {
  getProfile: () =>
    apiClient.get('/api/v1/users/profile'),
  
  updateProfile: (data: any) =>
    apiClient.put('/api/v1/users/profile', data),
  
  getDashboard: () =>
    apiClient.get('/api/v1/users/dashboard'),
};

// Função para formatar erros da API
export const formatApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.detail) {
    return error.detail;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Erro desconhecido';
};

// Função para mostrar notificações de erro
export const showApiError = (error: any): void => {
  const message = formatApiError(error);
  toast.error(message);
};

// Função para mostrar notificações de sucesso
export const showApiSuccess = (message: string): void => {
  toast.success(message);
};

// Função para formatar preços
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

// Função para formatar datas
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

// Função para formatar data e hora
export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// Função para debounce
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Função para throttle
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
