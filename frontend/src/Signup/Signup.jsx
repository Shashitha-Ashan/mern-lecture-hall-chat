/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../components/Login/login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSignIn() {
    if (password === confirmPassword) {
      try {
        const res = await api.post("/api/user/register", {
          username,
          email,
          password,
          year,
          role: "student",
        });
        setError(res.data.message);
        setConfirmPassword("");
        setEmail("");
        setPassword("");
        setUsername("");
        setYear("");
        navigate("/login");
      } catch (error) {
        setError("error");
        console.log(error);
      }
    } else {
      setError("Confirm password should match to the password");
    }
  }
  return (
    <div className="main-conatiner">
      <h1>Welcome to the LH chat</h1>
      {error !== null ? <div className="error">{error}</div> : ""}
      <div className="login-page-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSignIn();
          }}
        >
          <input
            type="text"
            placeholder="Your name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            required
            value={username}
          />
          <input
            type="email"
            placeholder="Academic Email or index No"
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
          <input
            type="text"
            placeholder="Confirm password"
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
            value={confirmPassword}
            required
          />

          <select
            name=""
            id=""
            onChange={(e) => {
              setYear(e.target.value);
            }}
          >
            <option value="">---Select year---</option>
            <option value="19/20">19/20</option>
            <option value="20/21">20/21</option>
            <option value="21/22">21/22</option>
            <option value="22/23">22/23</option>
          </select>

          <button type="submit">SignUp</button>
          <p className="signup">
            Are you have an account ?
            <span>
              <Link to="/login">Login</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
