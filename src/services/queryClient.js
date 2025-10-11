import { QueryClient } from '@tanstack/react-query';

// Create a client with optimized settings for caching
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      cacheTime: 10 * 60 * 1000, // 10 minutes - data stays in cache
      retry: 2, // Retry failed requests 2 times
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch when connection is restored
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
});
