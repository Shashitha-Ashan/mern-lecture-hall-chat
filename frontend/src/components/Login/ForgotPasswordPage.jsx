import { useState } from "react";
import axios from "axios";
import "./forgot-password.css";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post("api/user/forgotPassword", { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Somthing went wrong. Please try again later.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="forgot-email-input"
      />
      <button onClick={handleForgotPassword} className="forgot-button">
        Reset Password
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPasswordPage;
