import { UnistylesRegistry } from "react-native-unistyles";

const lightTheme = {
  colors: {
    background: "#ffffff",
    text: "#000000",
    primary: "#007AFF",
  },
};

const darkTheme = {
  colors: {
    background: "#000000",
    text: "#ffffff",
    primary: "#0A84FF",
  },
};

// 1. Definicja typów dla TypeScripta
type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

// 2. Rejestracja motywów w Unistyles v2
UnistylesRegistry.addThemes({
  light: lightTheme,
  dark: darkTheme,
}).addConfig({
  initialTheme: "light",
  adaptiveThemes: true,
});
