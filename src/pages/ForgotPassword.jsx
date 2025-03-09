import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`,
        { email }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error sending reset email:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        setMessage(error.response.data.message || "Failed to send reset email");
      } else if (error.request) {
        console.error("Request:", error.request);
        setMessage("No response received from the server.");
      } else {
        console.error("Error message:", error.message);
        setMessage("An error occurred while setting up the request.");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Remember your password? <a href="/login">Login here</a>.
      </p>
    </div>
  );
};

export default ForgotPassword;