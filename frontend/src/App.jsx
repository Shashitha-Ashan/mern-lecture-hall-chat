/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import LoginPage from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage";
import Home from "./Home";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ProtetedRoute from "./Routes/ProtectedHomeRoute";
import Profile from "./pages/Profile/Profile";
import CreateNew from "./pages/CreateNew/CreateNew";
import LecturerProtectedRoute from "./Routes/LecturerProtectedRoute";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import AdminRoute from "./Routes/AdminRoute";

function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    document.querySelector("body").setAttribute("data-theme", theme);
  }, []);
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route
            path="/profile"
            element={
              <ProtetedRoute>
                <Profile />
              </ProtetedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtetedRoute>
                <Home />
              </ProtetedRoute>
            }
          />
          <Route
            path="/chatroom/createnew"
            element={
              <ProtetedRoute>
                <LecturerProtectedRoute>
                  <CreateNew />
                </LecturerProtectedRoute>
              </ProtetedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/cpanel"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
