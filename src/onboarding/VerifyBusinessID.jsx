import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaLock } from "react-icons/fa";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../pages/firebase";
import OnboardingLayout from "./OnboardingLayout";

const VerifyBusinessID = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessID: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (attempts >= maxAttempts) {
        throw new Error("Maximum attempts reached. Please contact support.");
      }

      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Get the stored business ID from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const storedBusinessID = userDoc.data()?.businessID;

      if (!storedBusinessID) {
        throw new Error("No business ID found. Please set up your business ID first.");
      }

      if (formData.businessID !== storedBusinessID) {
        setAttempts(prev => prev + 1);
        throw new Error(`Incorrect business ID. ${maxAttempts - attempts} attempts remaining.`);
      }

      // Business ID verified successfully
      await updateDoc(doc(db, 'users', user.uid), {
        businessIDVerified: true,
        lastVerified: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });

      // Navigate to profile after successful verification
      navigate('/profile');
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={5} totalSteps={7}>
      <div className="onboarding-form">
        <h1>Security Verification Required</h1>
        <p className="subtext">
          For your security, you must verify your business ID each time you log in.
          This helps protect your business account from unauthorized access.
          You have {maxAttempts - attempts} verification attempts remaining.
        </p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="businessID">
              <FaLock className="form-icon" /> Enter Your Business ID
            </label>
            <input
              type="text"
              id="businessID"
              name="businessID"
              value={formData.businessID}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your business ID for verification"
              required
              disabled={attempts >= maxAttempts}
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading || attempts >= maxAttempts}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" /> 
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </button>
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default VerifyBusinessID; 