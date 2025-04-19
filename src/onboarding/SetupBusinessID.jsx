import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSpinner, FaLock, FaCheck, FaTimes } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../pages/firebase";
import OnboardingLayout from "./OnboardingLayout";

const SetupBusinessID = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    businessID: "",
    confirmBusinessID: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    matches: false
  });

  const validateBusinessID = (id) => {
    const minLength = id.length >= 8;
    const hasUpperCase = /[A-Z]/.test(id);
    const hasLowerCase = /[a-z]/.test(id);
    const hasNumber = /[0-9]/.test(id);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(id);

    return {
      hasMinLength: minLength,
      hasUpperCase: hasUpperCase,
      hasLowerCase: hasLowerCase,
      hasNumber: hasNumber,
      hasSpecialChar: hasSpecialChar
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "businessID") {
      setRequirements(prev => ({
        ...prev,
        ...validateBusinessID(value)
      }));
    } else if (name === "confirmBusinessID") {
      setRequirements(prev => ({
        ...prev,
        matches: value === formData.businessID
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate all requirements
      const allRequirementsMet = Object.values(requirements).every(req => req);
      if (!allRequirementsMet) {
        throw new Error("Please meet all business ID requirements");
      }

      if (formData.businessID !== formData.confirmBusinessID) {
        throw new Error("Business IDs do not match");
      }

      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          businessID: formData.businessID,
          onboardingStep: 'verify-business-id',
          lastUpdated: new Date().toISOString()
        });
      }
      
      navigate("/onboarding/verify-business-id", { 
        state: { 
          ...location.state,
          businessID: formData.businessID
        } 
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={4} totalSteps={7}>
      <div className="onboarding-form">
        <h1>Setup Your Business ID</h1>
        <p className="subtext">
          Create a secure business ID that you&apos;ll use to log in to your account.
          This ID must contain a combination of letters, numbers, and special characters.
          Please make it unique and memorable. Do not use your password or any other personal information.
        </p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="businessID">
              <FaLock className="form-icon" /> Business ID
            </label>
            <input
              type="text"
              id="businessID"
              name="businessID"
              value={formData.businessID}
              onChange={handleChange}
              className="form-input"
              placeholder="Create your business ID"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmBusinessID">
              <FaLock className="form-icon" /> Confirm Business ID
            </label>
            <input
              type="text"
              id="confirmBusinessID"
              name="confirmBusinessID"
              value={formData.confirmBusinessID}
              onChange={handleChange}
              className="form-input"
              placeholder="Confirm your business ID"
              required
            />
          </div>

          <div className="requirements-list">
            <h3>Business ID Requirements:</h3>
            <ul>
              <li className={requirements.hasMinLength ? "met" : ""}>
                {requirements.hasMinLength ? <FaCheck /> : <FaTimes />}
                At least 8 characters long
              </li>
              <li className={requirements.hasUpperCase ? "met" : ""}>
                {requirements.hasUpperCase ? <FaCheck /> : <FaTimes />}
                Contains uppercase letters
              </li>
              <li className={requirements.hasLowerCase ? "met" : ""}>
                {requirements.hasLowerCase ? <FaCheck /> : <FaTimes />}
                Contains lowercase letters
              </li>
              <li className={requirements.hasNumber ? "met" : ""}>
                {requirements.hasNumber ? <FaCheck /> : <FaTimes />}
                Contains numbers
              </li>
              <li className={requirements.hasSpecialChar ? "met" : ""}>
                {requirements.hasSpecialChar ? <FaCheck /> : <FaTimes />}
                Contains special characters
              </li>
              <li className={requirements.matches ? "met" : ""}>
                {requirements.matches ? <FaCheck /> : <FaTimes />}
                Business IDs match
              </li>
            </ul>
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading || !Object.values(requirements).every(req => req)}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" /> 
                Setting up...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default SetupBusinessID; 