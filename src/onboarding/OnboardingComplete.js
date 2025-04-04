import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingLayout from "./OnboardingLayout";
import { AuthContext } from "../AuthContext";

const OnboardingComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const handleComplete = () => {
    // In a real app, you would send all collected data to your backend
    // and then redirect to the appropriate dashboard
    navigate(user?.role === "seller" ? "/profile" : "/");
  };

  return (
    <OnboardingLayout currentStep={5} totalSteps={5}>
      <div className="onboarding-complete">
        <h2>You're all set!</h2>
        <p>Your account has been created successfully.</p>
        <p>We're preparing your personalized experience...</p>
        
        <button 
          onClick={handleComplete}
          className="complete-button"
        >
          Start using Folo
        </button>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingComplete;