/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useUserData, useUpdateUserData } from "../../Context/UserRoleContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const userData = useUserData();
  const userDataUpdate = useUpdateUserData();

  const navigate = useNavigate();
  useEffect(() => {
    if (userData) {
      setError("You are already logged");
    }
  }, [userData]);

  async function fetchUserData() {
    try {
      const response = await api.get("api/user/getrole");
      return response.data;
    } catch (error) {
      return null;
    }
  }
  const handleLogin = async () => {
    if (email != "" && password != "") {
      try {
        const response = await api.post("api/user/login", {
          email,
          password,
        });
        if (response.status === 200) {
          const user = await fetchUserData();
          userDataUpdate(user);
          if (user.role === "admin") {
            navigate("/cpanel", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }
      } catch (error) {
        setError(error.response.data);
        setPassword("");
        console.log(error);
      }
    } else {
      setError("Email and Password should not empty");
    }
  };
  return (
    <div className="main-conatiner">
      <h1>Welcome to the LH chat</h1>
      {error !== null ? <div className="error">{error}</div> : ""}
      <div className="login-page-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleLogin();
          }}
        >
          <input
            type="email"
            placeholder="Email or index No"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            required
            value={email}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            value={password}
            required
          />
          <Link to="/forgot-password" className="fogot-password">
            Forgot password ?
          </Link>
          <button type="submit">Login</button>
          <p className="signup">
            Not Registered ?{" "}
            <span>
              <Link to="/signup">Signup</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
