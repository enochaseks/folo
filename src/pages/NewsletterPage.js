import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useSearchParams } from "react-router-dom";
import validator from "validator";
import "../styles/global.css";

const NewsletterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Check for confirmation token on component mount
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      handleConfirmation(token);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmation = async (token) => {
    setIsSubmitting(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/newsletter/confirm`,
        { params: { token } }
      );
      
      setMessage({
        text: data.message || "Your subscription has been confirmed!",
        type: "success"
      });
      
      // Clear any form data
      setFormData({ name: "", email: "" });
      
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 
             "Invalid or expired confirmation link.",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!validator.isEmail(formData.email)) {
      setMessage({
        text: "Please enter a valid email address",
        type: "error"
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });
  
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/newsletter/subscribe`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );
      
      if (data.success) {
        setMessage({
          text: data.message || "Thank you for subscribing! Please check your email to confirm.",
          type: "success"
        });
        
        // Clear form on success
        setFormData({ name: "", email: "" });
        
        // Redirect to a specific page
        navigate('/home'); // Replace '/home' with the desired path
      }
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error?.message ||
                      "Failed to subscribe. Please try again later.";
      setMessage({
        text: errorMsg,
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="newsletter-page" style={{
      maxWidth: "600px",
      margin: "40px auto",
      padding: "30px",
      borderRadius: "15px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      backgroundColor: "white"
    }}>
      <h1 style={{
        color: "#ff6f61",
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "2rem"
      }}>
        Join Our Newsletter
      </h1>
      
      <p style={{
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "1.1rem",
        lineHeight: "1.6",
        color: "#333"
      }}>
        Subscribe to get early access to Folo, exclusive offers, and updates on Black-owned businesses in your area.
      </p>
      
      {message.text && (
        <div style={{
          padding: "15px",
          marginBottom: "25px",
          borderRadius: "8px",
          backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
          color: message.type === "success" ? "#155724" : "#721c24",
          textAlign: "center"
        }}>
          {message.text}
        </div>
      )}
      
      {!searchParams.get("token") && (
        <form onSubmit={handleSubmit} style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          <div>
            <label htmlFor="name" style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#333"
            }}>
              Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "1rem",
                transition: "border-color 0.3s",
                ":focus": {
                  outline: "none",
                  borderColor: "#ff6f61",
                  boxShadow: "0 0 0 2px rgba(255,111,97,0.2)"
                }
              }}
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label htmlFor="email" style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#333"
            }}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "1rem",
                transition: "border-color 0.3s",
                ":focus": {
                  outline: "none",
                  borderColor: "#ff6f61",
                  boxShadow: "0 0 0 2px rgba(255,111,97,0.2)"
                }
              }}
              placeholder="your@email.com"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: "#ff6f61",
              color: "white",
              border: "none",
              padding: "14px",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s",
              marginTop: "10px",
              ":hover": {
                backgroundColor: "#e74c3c",
                transform: "translateY(-2px)"
              },
              ":disabled": {
                backgroundColor: "#ccc",
                cursor: "not-allowed",
                transform: "none"
              }
            }}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe Now"}
          </button>
        </form>
      )}
      
      <p style={{
        marginTop: "30px",
        textAlign: "center",
        fontSize: "0.9rem",
        color: "#666"
      }}>
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsletterPage;