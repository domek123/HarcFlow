import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import { DashboardPage, LoginPage, TroopDetailsPage } from "@/pages";
import { configureApiClient } from "@harcapp/api-client";

import {
  NotFoundRedirect,
  ProtectedRoute,
  PublicOnlyRoute,
} from "./lib/protectedRoute";

configureApiClient(import.meta.env.VITE_API_URL);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/troop/:id"
          element={
            <ProtectedRoute>
              <TroopDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
