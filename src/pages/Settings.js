// Settings.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import "../styles/Settings.css";

const Settings = () => {
  const { user, deleteAccount } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user?.uid) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account? You will lose all your services if you have created one. If you want to go ahead, press OK"
    );

    if (confirmDelete) {
      deleteAccount();
      navigate("/");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>
      
      {/* Business ID Section */}
      {userData?.role === 'seller' && (
        <div className="business-id-section">
          <h2>Business ID Information</h2>
          {userData?.businessIDVerified ? (
            <div className="verified-business">
              <p><strong>Your Business ID:</strong> {userData.businessID}</p>
              <span className="verified-badge">Verified ✓</span>
            </div>
          ) : userData?.businessID ? (
            <div className="unverified-business">
              <p>Your business ID needs verification</p>
              <button 
                className="verify-button"
                onClick={() => navigate('/onboarding/verify-business-id')}
              >
                Verify Now
              </button>
            </div>
          ) : (
            <div className="no-business-id">
              <p>You haven&apos;t set up your business ID yet</p>
              <button 
                className="setup-button"
                onClick={() => navigate('/onboarding/setup-business-id')}
              >
                Set Up Business ID
              </button>
            </div>
          )}
        </div>
      )}

      <div className="danger-zone">
        <h3>Danger Zone</h3>
        <button onClick={handleDeleteAccount} className="delete-account-btn">
          Delete Account
        </button>
        <p className="warning-text">
          Warning: This action is irreversible. Your account will be scheduled for deletion after 14 days.
        </p>
      </div>
    </div>
  );
};

export default Settings;