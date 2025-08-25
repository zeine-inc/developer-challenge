'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Package, 
  Plus, 
  User, 
  LogOut, 
  Menu, 
  X,
  Package as PackageIcon,
  TrendingUp,
  Users
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useRequireAuth } from '@/contexts/AuthContext';

// Componente do Header
function Header({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [showSecret, setShowSecret] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);

  // Easter egg do botão "Novo produto"
  useEffect(() => {
    if (hoverTime >= 7000) {
      setShowSecret(true);
      // Esconder após 3 segundos
      setTimeout(() => setShowSecret(false), 3000);
    }
  }, [hoverTime]);

  const handleMouseEnter = () => {
    const interval = setInterval(() => {
      setHoverTime(prev => prev + 100);
    }, 100);

    return () => clearInterval(interval);
  };

  const handleMouseLeave = () => {
    setHoverTime(0);
    setShowSecret(false);
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <PackageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Marketplace</h1>
              <p className="text-xs text-gray-300">Painel de Vendedor</p>
            </div>
          </div>

          {/* Navegação */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Produtos</span>
            </Link>
          </nav>

          {/* Ações do usuário */}
          <div className="flex items-center space-x-4">
            {/* Botão Novo Produto com Easter Egg */}
            <div className="relative">
              <Link
                href="/products/new"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Novo produto</span>
              </Link>
              
              {/* Tooltip secreto */}
              {showSecret && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg animate-bounce-in">
                  <div className="relative">
                    Tá esperando o quê? Boraa moeer!! 🚀
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar do usuário */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user?.fullName || user?.email}</p>
                <p className="text-xs text-gray-300">Vendedor</p>
              </div>
            </div>

            {/* Botão Logout */}
            <button
              onClick={onLogout}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Componente de navegação mobile
function MobileNav({ isOpen, onClose, pathname }: { isOpen: boolean; onClose: () => void; pathname: string }) {
  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Menu */}
      <div className="fixed right-0 top-0 h-full w-64 bg-gray-800 shadow-xl transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <Link
            href="/dashboard"
            onClick={onClose}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === '/dashboard' 
                ? 'bg-primary-500 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          
          <Link
            href="/products"
            onClick={onClose}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname.startsWith('/products') 
                ? 'bg-primary-500 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Produtos</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const { isAuthenticated } = useRequireAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Loading state
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user} onLogout={logout} />
      
      {/* Navegação mobile */}
      <MobileNav 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        pathname={pathname}
      />

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
