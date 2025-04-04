import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingLayout from "./OnboardingLayout";

const UserType = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState(location.state?.role || "buyer");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userType) {
      setError("Please select how you plan to use Folo");
      return;
    }
    
    if (userType === "buyer") {
      navigate("/onboarding/buyer-interests", { 
        state: { 
          ...location.state,
          role: userType 
        } 
      });
    } else {
      navigate("/onboarding/seller-details", { 
        state: { 
          ...location.state,
          role: userType 
        } 
      });
    }
  };

  return (
    <OnboardingLayout currentStep={2} totalSteps={5}>
      <form onSubmit={handleSubmit} className="onboarding-form">
        <h2>How will you use Folo?</h2>
        <p>This helps us personalize your experience.</p>
        
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="userType"
              value="buyer"
              checked={userType === "buyer"}
              onChange={() => setUserType("buyer")}
            />
            <div className="radio-content">
              <h3>I want to shop</h3>
              <p>Find groceries, services, and more</p>
            </div>
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="userType"
              value="seller"
              checked={userType === "seller"}
              onChange={() => setUserType("seller")}
            />
            <div className="radio-content">
              <h3>I want to sell</h3>
              <p>List products or services on Folo</p>
            </div>
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

export default UserType;