import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store/store";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Profile from "./components/auth/Profile";
import Quiz from "./components/quiz/Quiz";
import UserList from "./components/admin/UserList";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Navbar from "./components/shared/Navbar";
import Certificate from "./components/certificate/Certificate";
import VerifyUser from "./components/auth/VerifyUser";
import HeroSection from "./components/home/HeroSection";
import AuthGuard from "./components/guards/AuthGuard";
import AdminGuard from "./components/guards/AdminGuard";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const storedPreference = localStorage.getItem("darkMode");
    return storedPreference ? storedPreference === "true" : true; // Default to true (dark)
  });

  // Save preference in localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Toggle function
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Router>
        <div
          className={`min-h-screen ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
          }`}
        >
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

          <Routes>
            <Route path="/" element={<HeroSection />} />

            <Route path="/register" element={<Register />} />

            <Route path="/verify-email/:tokenId" element={<VerifyUser />} />

            <Route path="/login" element={<Login />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route
              path="/reset-password/:tokenId"
              element={<ResetPassword />}
            />

            <Route
              path="/profile"
              element={
                <AuthGuard
                  component={<Profile darkMode={darkMode} />}
                  path="/profile"
                />
              }
            />

            <Route
              path="/quiz"
              element={<AuthGuard component={<Quiz />} path="/quiz" />}
            />

            <Route
              path="/certificate"
              element={
                <AuthGuard component={<Certificate />} path="/certificate" />
              }
            />

            <Route
              path="/admin"
              element={
                <AdminGuard component={<UserList darkMode={darkMode} />} />
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
