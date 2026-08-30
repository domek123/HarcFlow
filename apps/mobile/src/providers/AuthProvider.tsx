import { useEffect } from "react";

import { supabase } from "@lib/supabase";

import { useAuthStore } from "@/store/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((state) => state.setSession);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setInitialized]);

  return <>{children}</>;
}
