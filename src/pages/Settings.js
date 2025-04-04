// Settings.js
import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const {  deleteAccount } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account? You will lose all your services if you have created one. If you want to go ahead, press OK"
    );

    if (confirmDelete) {
      deleteAccount();
      navigate("/");
    }
  };

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>
      <div className="danger-zone">
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