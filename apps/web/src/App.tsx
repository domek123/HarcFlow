import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import { DashboardPage, LoginPage, TroopDetailsPage } from "@/pages";
import { configureApiClient } from "@harcapp/api-client";

configureApiClient(import.meta.env.VITE_API_URL);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/troop/:id" element={<TroopDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
