// Tipos de usuário
export interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos de produto
export type ProductStatus = 'draft' | 'active' | 'inactive' | 'sold';

export interface Product {
  id: string;
  userId: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  status: ProductStatus;
  viewsCount: number;
  likesCount: number;
  tags?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName?: string;
    email: string;
  };
}

// Tipos de autenticação
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Tipos de filtros
export interface ProductFilters {
  search?: string;
  status?: ProductStatus;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Tipos de estatísticas
export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  soldProducts: number;
  draftProducts: number;
  totalViews: number;
  totalLikes: number;
  totalValue: number;
}

export interface DashboardData {
  stats: {
    totalProducts: number;
    activeProducts: number;
    soldProducts: number;
    recentProducts: number;
    totalViews: number;
    totalValue: number;
  };
  topProducts: Array<{
    id: string;
    title: string;
    price: number;
    viewsCount: number;
    status: string;
  }>;
}

// Tipos de formulários
export interface ProductFormData {
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  status: ProductStatus;
  tags?: string;
}

export interface UserProfileFormData {
  fullName?: string;
  phone?: string;
  bio?: string;
}

// Tipos de upload
export interface UploadResponse {
  imageUrl: string;
}

// Tipos de notificações
export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

// Tipos de navegação
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

// Tipos de componentes
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string | number;
  onChange?: (value: string) => void;
  className?: string;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

// Tipos de gráficos
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface LineChartData {
  date: string;
  value: number;
}

// Tipos de paginação
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

// Tipos de modal
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Tipos de loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Tipos de contexto
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  loading: boolean;
}

// Tipos de hooks
export interface UseApiOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  retryDelay?: number;
}

// Tipos de validação
export interface ValidationError {
  field: string;
  message: string;
}

// Tipos de eventos
export interface FormSubmitEvent {
  preventDefault: () => void;
  target: HTMLFormElement;
}

// Tipos de arquivos
export interface FileUpload {
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

// Tipos de configuração
export interface AppConfig {
  apiUrl: string;
  cloudinaryCloudName?: string;
  environment: 'development' | 'production' | 'test';
}

// Tipos de tema
export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
}

// Tipos de localização
export interface Locale {
  language: string;
  region: string;
  currency: string;
  dateFormat: string;
}

// Tipos de analytics
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

// Tipos de cache
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Tipos de websocket
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
}

// Tipos de erro
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

// Tipos de sucesso
export interface ApiSuccess<T> {
  data: T;
  message: string;
  status: number;
}

// Tipos de resposta genérica
export type ApiResult<T> = ApiSuccess<T> | ApiError;

// Tipos de utilitários
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
