import { StyleSheet } from "react-native-unistyles";

const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
};

const lightTheme = {
  colors: {
    primary: "#1b4332",
    background: "#ffffff",
    text: "#24292e",
    card: "#f0f7f4",
  },
  margins: {
    sm: 8,
    md: 16,
    lg: 24,
  },
};

const appThemes = {
  light: lightTheme,
};

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

// Składnia Unistyles v3
StyleSheet.configure({
  breakpoints,
  themes: appThemes,
  settings: {
    initialTheme: "light",
  },
});
