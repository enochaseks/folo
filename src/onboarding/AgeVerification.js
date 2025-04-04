import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const AgeVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    idDocument: null,
    documentType: "drivers_license"
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1);

  // Basic styles
  const styles = {
    container: {
      maxWidth: "500px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    },
    title: {
      color: "#333",
      marginBottom: "10px"
    },
    description: {
      color: "#666",
      marginBottom: "20px"
    },
    formGroup: {
      marginBottom: "20px"
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "500",
      color: "#444"
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "16px"
    },
    select: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      backgroundColor: "white",
      fontSize: "16px"
    },
    button: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "12px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px"
    },
    error: {
      color: "#d32f2f",
      backgroundColor: "#fdecea",
      padding: "12px",
      borderRadius: "4px",
      marginBottom: "20px"
    },
    smallText: {
      fontSize: "12px",
      color: "#777",
      marginTop: "5px",
      display: "block"
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }
    setFormData({ ...formData, idDocument: file });
    setError("");
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const verifyBasicAge = () => {
    if (!formData.dateOfBirth) {
      setError("Please enter your date of birth");
      return false;
    }

    const birthDate = new Date(formData.dateOfBirth);
    const age = calculateAge(birthDate);

    if (age < 18) {
      setError("You must be at least 18 years old to use this service");
      return false;
    }

    if (age >= 18 && age < 21) {
      setVerificationStep(2);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (verificationStep === 1) {
        if (verifyBasicAge()) {
          navigate("/onboarding/user-type", { 
            state: { 
              ...location.state,
              dateOfBirth: formData.dateOfBirth,
              ageVerified: true 
            } 
          });
          return;
        }
        return;
      }

      if (!formData.idDocument) {
        throw new Error("Please upload an ID document");
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate("/onboarding/user-type", { 
        state: { 
          ...location.state,
          dateOfBirth: formData.dateOfBirth,
          ageVerified: true 
        } 
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Age Verification</h2>
      <p style={styles.description}>To comply with regulations, we need to verify your age.</p>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {verificationStep === 1 ? (
          <div style={styles.formGroup}>
            <label style={styles.label}>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
              style={styles.input}
            />
          </div>
        ) : (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>ID Document Type</label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="drivers_license">Driver's License</option>
                <option value="passport">Passport</option>
                <option value="id_card">National ID Card</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Upload ID Document</label>
              <input
                type="file"
                name="idDocument"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                required
                style={styles.input}
              />
              <small style={styles.smallText}>
                Accepted formats: JPG, PNG, PDF (max 5MB). We'll verify your age but won't store the document.
              </small>
            </div>
          </>
        )}
        
        <button 
          type="submit" 
          style={{ 
            ...styles.button,
            backgroundColor: isLoading ? "#999" : "#4CAF50" 
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> 
              Processing...
            </>
          ) : (
            verificationStep === 1 ? "Continue" : "Verify Age"
          )}
        </button>
      </form>
    </div>
  );
};

export default AgeVerification;