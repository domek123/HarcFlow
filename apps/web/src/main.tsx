import { StrictMode } from "react";

import "./i18n/config";
import { createRoot } from "react-dom/client";

import { ApiProvider } from "@harcapp/api-client";

import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApiProvider>
      <App />
      <Toaster />
    </ApiProvider>
  </StrictMode>,
);
