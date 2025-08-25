'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Tempo de cache padrão (5 minutos)
            staleTime: 5 * 60 * 1000,
            // Tempo de cache em background (10 minutos)
            gcTime: 10 * 60 * 1000,
            // Tentativas de retry
            retry: (failureCount, error: any) => {
              // Não tentar novamente para erros 4xx (exceto 408, 429)
              if (
                error?.status >= 400 &&
                error?.status < 500 &&
                error?.status !== 408 &&
                error?.status !== 429
              ) {
                return false;
              }
              // Máximo de 3 tentativas
              return failureCount < 3;
            },
            // Delay entre tentativas (exponencial)
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch quando a janela ganha foco
            refetchOnWindowFocus: false,
            // Refetch quando reconecta
            refetchOnReconnect: true,
            // Refetch em intervalos (desabilitado por padrão)
            refetchInterval: false,
            // Refetch em background
            refetchIntervalInBackground: false,
          },
          mutations: {
            // Tentativas de retry para mutations
            retry: (failureCount, error: any) => {
              // Não tentar novamente para erros 4xx (exceto 408, 429)
              if (
                error?.status >= 400 &&
                error?.status < 500 &&
                error?.status !== 408 &&
                error?.status !== 429
              ) {
                return false;
              }
              // Máximo de 2 tentativas para mutations
              return failureCount < 2;
            },
            // Delay entre tentativas para mutations
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 10000),
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools apenas em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};
