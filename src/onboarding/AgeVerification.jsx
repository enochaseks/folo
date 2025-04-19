import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../pages/firebase";
import "../styles/OnboardingStyles.css";
import "../styles/global.css";
import logo from "../images/logo.png";
import { FaSpinner, FaCalendarAlt, FaUpload } from "react-icons/fa";

const AgeVerification = () => {
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    documentFile: null,
    previewUrl: null
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1);
  const navigate = useNavigate();

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setFormData(prev => ({
          ...prev,
          documentFile: file,
          previewUrl: URL.createObjectURL(file)
        }));
      } catch (error) {
        setError("Failed to process the file. Please try again.");
      }
    }
  };

  const verifyBasicAge = () => {
    if (!formData.dateOfBirth) {
      setError("Please enter your date of birth");
      return false;
    }

    const age = calculateAge(formData.dateOfBirth);
    if (age < 18) {
      setError("You must be at least 18 years old to use Folo");
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
        if (!verifyBasicAge()) {
          setIsLoading(false);
          return;
        }
        setVerificationStep(2);
        setIsLoading(false);
        return;
      }

      // Step 2: Document verification
      if (!formData.documentFile) {
        setError("Please upload a valid ID document");
        setIsLoading(false);
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Update user document with age verification status
      await updateDoc(doc(db, 'users', user.uid), {
        dateOfBirth: formData.dateOfBirth,
        ageVerified: true,
        verificationDocument: formData.documentFile.name,
        lastUpdated: new Date().toISOString()
      });

      // Navigate to next step
      navigate('/onboarding/user-type');
    } catch (error) {
      console.error('Age verification error:', error);
      setError(error.message || "Failed to verify age. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-content">
        <img src={logo} alt="Folo Logo" className="onboarding-logo" />
        
        <div className="onboarding-form">
          <h1>Age Verification</h1>
          <p className="subtext">
            {verificationStep === 1 
              ? "Please enter your date of birth to verify you're 18 or older"
              : "Please upload a valid ID document for verification"}
          </p>

          <form onSubmit={handleSubmit}>
            {verificationStep === 1 ? (
              <div className="form-group">
                <label htmlFor="dateOfBirth">
                  <FaCalendarAlt /> Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="documentFile">
                  <FaUpload /> Upload ID Document
                </label>
                <input
                  type="file"
                  id="documentFile"
                  name="documentFile"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="form-input"
                  required
                />
                {formData.previewUrl && (
                  <div className="preview-container">
                    <img src={formData.previewUrl} alt="Document Preview" className="preview-image" />
                  </div>
                )}
              </div>
            )}

            {error && <p className="error-message">{error}</p>}

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <FaSpinner className="spinner" />
              ) : verificationStep === 1 ? (
                "Continue"
              ) : (
                "Verify Age"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification; 