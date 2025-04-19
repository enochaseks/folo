import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../images/logo.png";
import "../styles/global.css";
import "../styles/AuthStyles.css";

const OnboardingLayout = ({ children, currentStep, totalSteps }) => {
  const navigate = useNavigate();
  
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <img src={logo} alt="Folo Logo" className="onboarding-logo" />
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="onboarding-content">
        {children}
      </div>
      
      <div className="onboarding-footer">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <span className="step-counter">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
};

OnboardingLayout.propTypes = {
  children: PropTypes.node.isRequired,
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired
};

export default OnboardingLayout;