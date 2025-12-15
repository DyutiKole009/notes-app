import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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

  // Sync auth state once on load
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <Router>
      <Routes>

        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to="/dashboard" replace />
              : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignUp />}
        />

        {/* 🔒 PROTECTED ROUTE */}
        <Route
          path="/"
          element={
            isLoggedIn
              ? <DashboardLayout setIsLoggedIn={setIsLoggedIn} />
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Home />} />
          <Route path="recent" element={<Recent />} />
          <Route path="insights" element={<Insights />} />
          <Route path="ocr" element={<OCR />} />
          <Route path="voice-notes" element={<VoiceNotes />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
};

export default App;
