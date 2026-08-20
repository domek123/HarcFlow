import { reactConfig } from "./react.mjs";
import reactNativePlugin from "eslint-plugin-react-native";

export const reactNativeConfig = [
  ...reactConfig,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "react-native": reactNativePlugin,
    },
    rules: {
      "react-native/no-unused-styles": "error",
      "react-native/no-inline-styles": "warn",
      "react-native/no-color-literals": "off",
    },
  },
];
