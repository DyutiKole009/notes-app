import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home/Home";
import Insights from "./pages/Insights/Insights";
import Recent from "./pages/Recent/Recent";
import OCR from "./pages/AI/OCR";
import VoiceNotes from "./pages/AI/VoiceNotes";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔐 single source of truth for auth
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <Router>
      <Routes>

        {/* ---------- LOGIN ---------- */}
        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to="/" replace />
              : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        {/* ---------- SIGNUP ---------- */}
        <Route
          path="/signup"
          element={
            isLoggedIn
              ? <Navigate to="/" replace />
              : <SignUp />
          }
        />

        {/* ---------- PROTECTED ROOT ---------- */}
        <Route
          path="/"
          element={
            isLoggedIn
              ? <DashboardLayout setIsLoggedIn={setIsLoggedIn} />
              : <Navigate to="/login" replace />
          }
        >
          {/* default page */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* dashboard pages */}
          <Route path="dashboard" element={<Home />} />
          <Route path="recent" element={<Recent />} />
          <Route path="insights" element={<Insights />} />
          <Route path="ocr" element={<OCR />} />
          <Route path="voice-notes" element={<VoiceNotes />} />
        </Route>

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
};

export default App;
