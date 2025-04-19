import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingLayout from "./OnboardingLayout";
import { updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../pages/firebase";

const UserType = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState(location.state?.role || "buyer");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userType) {
      setError("Please select how you plan to use Folo");
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');

      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Update user role in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        role: userType,
        onboardingComplete: true,
        onboardingStep: userType === 'buyer' ? 'complete' : 'seller-details',
        lastUpdated: new Date().toISOString()
      });

      // Update local storage
      localStorage.setItem('userRole', userType);
      localStorage.setItem('onboardingComplete', 'true');

      // Navigate based on role
      if (userType === 'buyer') {
        navigate('/profile');
      } else {
        navigate('/onboarding/seller-details', { 
          state: { 
            ...location.state,
            role: 'seller' 
          } 
        });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setError('Failed to update role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={2} totalSteps={7}>
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
        
        <button type="submit" className="continue-button" disabled={isLoading}>
          Continue
        </button>
      </form>
    </OnboardingLayout>
  );
};

export default UserType;