import { UnistylesRegistry } from "react-native-unistyles";

export const lightTheme = {
  colors: {
    background: "#F8F6F0",
    foreground: "#1A231C",

    card: "#FAF9F5",
    cardForeground: "#1A231C",
    popover: "#FAF9F5",
    popoverForeground: "#1A231C",

    primary: "#295133",
    primaryForeground: "#FAF8F4",

    secondary: "#EFE3CE",
    secondaryForeground: "#23442B",

    muted: "#EAE5DB",
    mutedForeground: "#5D6F61",

    accent: "#E6DCCE",
    accentForeground: "#203E27",

    destructive: "#A63030",
    destructiveForeground: "#FAF8F4",

    border: "#DFD8CC",
    input: "#DFD8CC",
    ring: "#295133",
  },
  margins: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },
} as const;

export const darkTheme = {
  colors: {
    background: "#101912",
    foreground: "#EFECE6",

    card: "#17221A",
    cardForeground: "#EFECE6",
    popover: "#17221A",
    popoverForeground: "#EFECE6",

    primary: "#4C895E",
    primaryForeground: "#101912",

    secondary: "#27352A",
    secondaryForeground: "#EFECE6",

    muted: "#223025",
    mutedForeground: "#99A89C",

    accent: "#3D332B",
    accentForeground: "#EFECE6",

    destructive: "#7A1D1D",
    destructiveForeground: "#EFECE6",

    border: "#2B3B2E",
    input: "#2B3B2E",
    ring: "#4C895E",
  },
  margins: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },
} as const;

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addThemes({
  light: lightTheme,
  dark: darkTheme,
}).addConfig({
  adaptiveThemes: true,
  initialTheme: "light",
});
