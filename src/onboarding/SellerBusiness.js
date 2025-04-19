import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingLayout from "./OnboardingLayout";
import { auth } from "../pages/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../pages/firebase";

const SellerBusiness = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    businessOrigin: "",
    businessAge: "",
    productTypes: []
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const productOptions = [
    "Groceries",
    "Prepared Foods",
    "Household Items",
    "Personal Care",
    "Electronics",
    "Clothing",
    "Other"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      productTypes: checked 
        ? [...prev.productTypes, value] 
        : prev.productTypes.filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          ...formData,
          onboardingStep: 'complete',
          onboardingComplete: true,
          lastUpdated: new Date().toISOString()
        });
      }
      
      navigate("/onboarding/complete", { 
        state: { 
          ...location.state,
          ...formData
        } 
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={6} totalSteps={7}>
      <form onSubmit={handleSubmit} className="onboarding-form">
        <h2>More about your business</h2>
        <p>This helps us connect you with the right customers.</p>
        
        <div className="form-group">
          <label>Business Origin</label>
          <select
            name="businessOrigin"
            value={formData.businessOrigin}
            onChange={handleChange}
            required
          >
            <option value="">Select origin</option>
            <option value="local">Local business</option>
            <option value="national">National brand</option>
            <option value="international">International brand</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>How long have you been in business?</label>
          <select
            name="businessAge"
            value={formData.businessAge}
            onChange={handleChange}
            required
          >
            <option value="">Select business age</option>
            <option value="new">Less than 1 year</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>What types of products do you sell?</label>
          <div className="checkbox-grid">
            {productOptions.map((option) => (
              <label key={option} className="checkbox-option">
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.productTypes.includes(option)}
                  onChange={handleCheckboxChange}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" className="continue-button" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Continue"}
        </button>
      </form>
    </OnboardingLayout>
  );
};

export default SellerBusiness;