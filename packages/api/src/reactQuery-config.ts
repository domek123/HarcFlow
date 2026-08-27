import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        retry: (failureCount, error: any) => {
          if (error?.status === 403 || error?.code === "42501") return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });

export const queryClient = createQueryClient();
