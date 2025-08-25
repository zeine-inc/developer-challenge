'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Package, TrendingUp, Users } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useRedirectIfAuthenticated } from '@/contexts/AuthContext';

// Schema de validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex">
      {/* Seção Esquerda - Ilustrativa */}
      <div className="hidden lg:flex lg:w-1/2 bg-white rounded-r-3xl p-8 relative overflow-hidden">
        {/* Logo e Branding */}
        <div className="absolute top-8 left-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Marketplace</h1>
              <p className="text-sm text-gray-600">Painel de Vendedor</p>
            </div>
          </div>
        </div>

        {/* Elementos Visuais */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Caixa de papelão central */}
          <div className="relative">
            <div className="w-32 h-24 bg-amber-100 rounded-lg shadow-lg flex items-center justify-center">
              <Package className="w-8 h-8 text-amber-600" />
            </div>
            
            {/* Linha ondulada */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 150">
              <path
                d="M20,75 Q50,25 80,75 T140,75 T200,75"
                stroke="#f97316"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            {/* Balões de recursos */}
            <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-blue-100">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-secondary-500" />
                <span className="text-xs text-gray-700">Acompanhe os produtos vendidos</span>
              </div>
            </div>

            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-blue-100">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-secondary-500" />
                <span className="text-xs text-gray-700">Gerencie seus anúncios</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-blue-100">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-secondary-500" />
                <span className="text-xs text-gray-700">Veja sua loja crescendo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Direita - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Acesse sua conta</h1>
            <p className="text-gray-300">Informe seu e-mail e senha para entrar</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                E-MAIL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder="Seu e-mail cadastrado"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                SENHA
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Sua senha de acesso"
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Acessar</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Link para Cadastro */}
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Ainda não tem uma conta?{' '}
              <Link
                href="/register"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Cadastrar
              </Link>
            </p>
          </div>

          {/* Credenciais de Demo */}
          <div className="mt-8 p-4 bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-300 text-center">
              <strong>Credenciais de Demo:</strong>
              <br />
              Email: demo@example.com
              <br />
              Senha: Demo123!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
