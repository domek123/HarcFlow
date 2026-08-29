import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { supabase } from "@lib/supabase";
import type { AuthUser } from "../features/auth/types/auth.types";

type AuthState = {
  session: Session | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setSession: (session: Session | null) => void;
  setHydrated: () => void;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const mapUser = (user: User | null): AuthUser | null => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
    name: user.user_metadata?.full_name ?? user.email ?? "Użytkownik",
    avatarUrl: user.user_metadata?.avatar_url ?? null,
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      setSession: (session) =>
        set({
          session,
          user: mapUser(session?.user ?? null),
          isAuthenticated: Boolean(session),
        }),
      setHydrated: () => set({ isHydrated: true }),
      initialize: async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        set({
          session,
          user: mapUser(session?.user ?? null),
          isAuthenticated: Boolean(session),
          isHydrated: true,
        });
      },
      login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        set({
          session: data.session,
          user: mapUser(data.user),
          isAuthenticated: Boolean(data.session),
          isHydrated: true,
        });
      },
      logout: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
          throw error;
        }

        set({
          session: null,
          user: null,
          isAuthenticated: false,
          isHydrated: true,
        });
      },
    }),
    {
      name: "harc-auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
