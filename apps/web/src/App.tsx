import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import {
  DashboardPage,
  LoginPage,
  ResetPasswordPage,
  SetNewPasswordPage,
  TroopDetailsPage,
} from "@/pages";
import { configureApiClient } from "@harcapp/api-client";

import {
  NotFoundRedirect,
  ProtectedLayout,
  PublicOnlyLayout,
} from "./lib/protectedRoute";

configureApiClient(import.meta.env.VITE_API_URL);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/set-new-password" element={<SetNewPasswordPage />} />
        </Route>

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/troop/:id" element={<TroopDetailsPage />} />
        </Route>
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
