import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'

import { DashboardPage, LoginPage  } from "@/pages";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
