import { reactConfig } from "./react.mjs";
import { fixupPluginRules } from "@eslint/compat";
import reactNativePlugin from "eslint-plugin-react-native";
import globals from "globals";

export const reactNativeConfig = [
  ...reactConfig,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "react-native": fixupPluginRules(reactNativePlugin),
    },
    languageOptions: {
      globals: {
        ...globals["react-native/react-native"], // Włącza m.in. __DEV__, requestAnimationFrame itp.
      },
    },
    rules: {
      "react-native/no-unused-styles": "error",
      "react-native/no-inline-styles": "warn",
      "react-native/no-color-literals": "off",
    },
  },
];
