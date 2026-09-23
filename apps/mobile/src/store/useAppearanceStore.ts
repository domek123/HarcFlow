import AsyncStorage from "@react-native-async-storage/async-storage";
import { UnistylesRuntime } from "react-native-unistyles";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AppearanceOption = "light" | "dark" | "system";

type AppearanceState = {
  appearance: AppearanceOption;
  isHydrated: boolean;
  setAppearance: (appearance: AppearanceOption) => void;
};

export function applyAppearance(appearance: AppearanceOption) {
  if (appearance === "system") {
    UnistylesRuntime.setAdaptiveThemes(true);
    return;
  }

  UnistylesRuntime.setAdaptiveThemes(false);
  UnistylesRuntime.setTheme(appearance);
}

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      appearance: "system",
      isHydrated: false,
      setAppearance: (appearance) => {
        applyAppearance(appearance);
        set({ appearance });
      },
    }),
    {
      name: "appearance-preference",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ appearance: state.appearance }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyAppearance(state.appearance);
        }

        useAppearanceStore.setState({ isHydrated: true });
      },
    },
  ),
);
