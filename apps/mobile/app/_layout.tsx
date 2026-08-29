import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "../src/i18n/config";
import "../src/styles/unistyles";
import { useAuthStore } from "../src/store/useAuthStore";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isHydrated, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isHydrated) {
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
  }, [isAuthenticated, isHydrated, router, segments]);

  return <Slot />;
}
