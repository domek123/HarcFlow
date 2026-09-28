import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import {
  DashboardPage,
  DegreeTemplatesPage,
  LoginPage,
  MembersPage,
  ParentsAndConsentsPage,
  RanksAndSkillsPage,
  ResetPasswordPage,
  SetNewPasswordPage,
  StatisticsPage,
  TroopDetailsPage,
  WarehousePage,
  WorkPlanPage,
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
          <Route path="/troop/:id" element={<TroopDetailsPage />}>
            <Route index element={<Navigate to="members" replace />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="ranks-and-skills" element={<RanksAndSkillsPage />} />
            <Route path="degrees/templates" element={<DegreeTemplatesPage />} />
            <Route
              path="parents-and-consents"
              element={<ParentsAndConsentsPage />}
            />
            <Route path="warehouse" element={<WarehousePage />} />
            <Route path="statistics" element={<StatisticsPage />} />
            <Route path="work-plan" element={<WorkPlanPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
