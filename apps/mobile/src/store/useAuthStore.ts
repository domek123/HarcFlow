import { create } from "zustand";

import type { Session } from "@supabase/supabase-js";

type AuthState = {
  session: Session | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setSession: (session: Session | null) => void;
  setInitialized: (initialized: boolean) => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  session: null,
  isAuthenticated: false,
  isInitialized: false,

  setSession: (session) =>
    set({
      session,
      isAuthenticated: Boolean(session),
    }),

  setInitialized: (isInitialized) => set({ isInitialized }),
}));
