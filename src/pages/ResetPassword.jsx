import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/reset-password`,
        { token, password }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;