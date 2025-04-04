import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/confirm-email?token=${token}`)
        .then((response) => {
          if (response.data.success) {
            alert("Email confirmed successfully! You can now log in.");
            navigate("/login");
          } else {
            alert(response.data.message || "Invalid or expired token.");
            navigate("/signup");
          }
        })
        .catch((error) => {
          console.error("Email confirmation failed:", error);
          alert("Email confirmation failed. Please try again.");
          navigate("/signup");
        });
    } else {
      alert("Invalid confirmation link.");
      navigate("/signup");
    }
  }, [searchParams, navigate]);

  return <div>Confirming your email...</div>;
};

export default ConfirmEmail;