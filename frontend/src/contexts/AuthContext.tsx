'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { User, LoginCredentials, RegisterData, AuthResponse } from '@/types';
import { authAPI, showApiError } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Verificar se o usuário está autenticado ao carregar a aplicação
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        // Verificar se o token ainda é válido
        try {
          await authAPI.verify();
          setUser(JSON.parse(userData));
        } catch (error) {
          // Token inválido, tentar renovar
          await refreshToken();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Limpar dados inválidos
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = (await authAPI.login(credentials)) as unknown as AuthResponse;

      // Salvar tokens e dados do usuário
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user);
      toast.success('Login realizado com sucesso!');
      
      // Redirecionar para o dashboard
      router.push('/dashboard');
    } catch (error) {
      showApiError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = (await authAPI.register({
        email: data.email,
        password: data.password,
        full_name: data.fullName,
        phone: data.phone,
      })) as unknown as AuthResponse;

      // Salvar tokens e dados do usuário
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user);
      toast.success('Conta criada com sucesso!');
      
      // Redirecionar para o dashboard
      router.push('/dashboard');
    } catch (error) {
      showApiError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      // Chamar endpoint de logout (opcional)
      authAPI.logout().catch(console.error);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Limpar dados locais
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      setUser(null);
      toast.success('Logout realizado com sucesso!');
      
      // Redirecionar para login
      router.push('/login');
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = (await authAPI.refresh(refreshToken)) as unknown as AuthResponse;

      // Atualizar tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user);
      return;
    } catch (error) {
      console.error('Error refreshing token:', error);
      
      // Limpar dados inválidos
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      setUser(null);
      router.push('/login');
      return;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para proteger rotas
export const useRequireAuth = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  return { isAuthenticated, loading };
};

// Hook para redirecionar usuários autenticados
export const useRedirectIfAuthenticated = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  return { isAuthenticated, loading };
};
