import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingLayout from "../onboarding/OnboardingLayout";

const BuyerInterests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [interests, setInterests] = useState({
    groceries: false,
    services: false,
    localProducts: false,
    subscriptions: false
  });
  const [error, setError] = useState("");

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setInterests({ ...interests, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!Object.values(interests).some(val => val)) {
      setError("Please select at least one interest");
      return;
    }
    
    navigate("/onboarding/complete", { 
      state: { 
        ...location.state,
        interests 
      } 
    });
  };

  return (
    <OnboardingLayout currentStep={3} totalSteps={5}>
      <form onSubmit={handleSubmit} className="onboarding-form">
        <h2>What are you looking for?</h2>
        <p>Select all that apply to help us show you relevant options.</p>
        
        <div className="checkbox-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              name="groceries"
              checked={interests.groceries}
              onChange={handleCheckboxChange}
            />
            <span>Grocery shopping</span>
          </label>
          
          <label className="checkbox-option">
            <input
              type="checkbox"
              name="services"
              checked={interests.services}
              onChange={handleCheckboxChange}
            />
            <span>Local services</span>
          </label>
          
          <label className="checkbox-option">
            <input
              type="checkbox"
              name="localProducts"
              checked={interests.localProducts}
              onChange={handleCheckboxChange}
            />
            <span>Local products</span>
          </label>
          
          <label className="checkbox-option">
            <input
              type="checkbox"
              name="subscriptions"
              checked={interests.subscriptions}
              onChange={handleCheckboxChange}
            />
            <span>Subscription services</span>
          </label>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" className="continue-button">
          Continue
        </button>
      </form>
    </OnboardingLayout>
  );
};

export default BuyerInterests;