import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Static data never goes stale
      gcTime: 1000 * 60 * 30, // Keep unused data for 30 min
      refetchOnWindowFocus: false, // No refetch on focus (static data)
      refetchOnReconnect: false, // No refetch on reconnect
      retry: 1, // One retry for loading failures
    },
  },
});
