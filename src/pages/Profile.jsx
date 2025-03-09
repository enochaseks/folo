import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import '../styles/global.css';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile-container">
      <div className="profile-picture-container">
        <img
          src="https://via.placeholder.com/150" // Replace with your profile picture URL
          alt="Profile"
          className="profile-picture"
        />
      </div>
      {user && <p>Welcome, {user.name}!</p>}
    </div>
  );
};

export default Profile;