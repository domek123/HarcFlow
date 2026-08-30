import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "../src/i18n/config";
import "../src/styles/unistyles";
import { useAuthStore } from "../src/store/useAuthStore";
import { AuthProvider } from "@/providers/AuthProvider";
import { configureApiClient } from "@harcapp/api-client";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/lib/toastConfig";

configureApiClient(process.env.EXPO_PUBLIC_API_URL!);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function RouteGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(main)");
    }
  }, [isAuthenticated, isInitialized, router, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouteGuard />
        <Toast config={toastConfig} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
