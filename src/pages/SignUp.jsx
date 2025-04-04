import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import '../styles/AuthStyles.css';
import '../styles/global.css';
import logo from '../images/logo.png';
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { auth, googleProvider, sendEmailLink, isEmailLink, completeEmailSignIn } from './firebase';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "buyer"
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if this is a callback from email link
    if (isEmailLink(location.href)) {
      handleEmailLinkCallback();
    }
  }, [location]);

  const handleEmailLinkCallback = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Get the email from localStorage or prompt the user
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      if (!email) {
        throw new Error('Email is required to complete sign in');
      }

      const result = await completeEmailSignIn(email, location.href);
      
      if (result.success) {
        const idToken = await result.user.getIdToken();
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/firebase`, 
          { idToken }
        );
        
        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          navigate("/onboarding/age-verification");
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Email link sign in error:", error);
      setError(error.message || "Failed to complete sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    
    try {
      if (!formData.email || !formData.name) {
        throw new Error("Please fill in all fields");
      }

      const result = await sendEmailLink(formData.email);
      
      if (result.success) {
        setMessage("Check your email for the sign up link!");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError(error.message || "Failed to send sign up link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider) => {
    try {
      setIsLoading(true);
      setError("");
      
      let result;
      if (provider === "google") {
        result = await signInWithPopup(auth, googleProvider);
      } else if (provider === "facebook") {
        result = await signInWithPopup(auth, new FacebookAuthProvider());
      }

      const idToken = await result.user.getIdToken();
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/firebase`, 
        { idToken }
      );
      
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate("/onboarding/age-verification");
      }
    } catch (error) {
      console.error("Firebase auth error:", error);
      setError(error.message || "Social sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="background-slideshow">
        <div className="slide slide1"></div>
        <div className="slide slide2"></div>
        <div className="slide slide3"></div>
      </div>
      
      <div className="auth-content">
        <img src={logo} alt="Folo Logo" className="auth-logo" />
        <div className="auth-form">
          <h1>Sign Up</h1>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
              />
            </div>
            
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>I want to:</label>
              <select 
                name="role" 
                value={formData.role}
                onChange={handleChange}
                className="role-select"
              >
                <option value="buyer">Shop on Folo</option>
                <option value="seller">Sell on Folo</option>
              </select>
            </div>
            
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Sign Up Link"}
            </button>
          </form>
          
          <div className="divider">
            <span>OR</span>
          </div>
          
          <div className="social-login-buttons">
            <button 
              className="social-btn google"
              onClick={() => handleSocialSignUp("google")}
              disabled={isLoading}
            >
              <FaGoogle /> Continue with Google
            </button>
            
            <button 
              className="social-btn facebook"
              onClick={() => handleSocialSignUp("facebook")}
              disabled={isLoading}
              style={{ backgroundColor: "#1877F2", color: "white" }}
            >
              <FaFacebook /> Continue with Facebook
            </button>
          </div>
          
          <p className="auth-link">
            Already have an account? <Link to="/login">Login here</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;