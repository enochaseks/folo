import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../pages/firebase";
import OnboardingLayout from "./OnboardingLayout";

const OnboardingComplete = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const completeOnboarding = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Get user data to check role
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          
          await updateDoc(doc(db, 'users', user.uid), {
            onboardingComplete: true,
            onboardingStep: 'complete',
            lastUpdated: new Date().toISOString()
          });

          // Navigate based on user role
          if (userData?.role === 'seller') {
            navigate("/profile");
          } else {
            navigate("/profile");
          }
        }
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    };
    
    completeOnboarding();
  }, [navigate]);

  return (
    <OnboardingLayout currentStep={7} totalSteps={7}>
      <div className="onboarding-form">
        <h1>Onboarding Complete!</h1>
        <p className="subtext">
          Congratulations! You&apos;ve successfully completed the onboarding process.
          You can now start using Folo to its full potential.
        </p>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingComplete;