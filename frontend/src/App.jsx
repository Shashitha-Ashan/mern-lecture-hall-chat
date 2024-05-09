/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import LoginPage from "./components/Login/Login";
import Signup from "./Signup/Signup";
import Home from "./Home";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ProtetedRoute from "./Routes/ProtectedHomeRoute";
import Profile from "./components/Profile/Profile";
import CreateNew from "./components/CreateNew/CreateNew";
import LecturerProtectedRoute from "./Routes/LecturerProtectedRoute";
import AdminPanel from "./components/AdminPanel/AdminPanel";
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
