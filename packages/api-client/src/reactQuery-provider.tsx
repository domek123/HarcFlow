import * as React from "react";
import type { ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { queryClient as defaultQueryClient } from "./reactQuery-config";

interface ApiProviderProps {
  children: ReactNode;
  client?: QueryClient;
}

export function ApiProvider({
  children,
  client = defaultQueryClient,
}: ApiProviderProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
