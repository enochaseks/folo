import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import '../../styles/OnboardingStyles.css';
import '../../styles/global.css';
import logo from '../../images/logo.png';

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    interests: []
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.displayName) {
      setError('Please enter a display name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          ...formData,
          onboardingStep: 'complete',
          lastUpdated: new Date().toISOString()
        });
        
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error during profile setup:', error);
      setError('Failed to save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-content">
        <img src={logo} alt="Folo Logo" className="onboarding-logo" />
        
        <div className="onboarding-form">
          <h1>Complete Your Profile</h1>
          <p className="subtext">
            Tell us a bit about yourself to help others get to know you better.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="form-input"
                placeholder="What should we call you?"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="form-input"
                placeholder="Tell us about yourself..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                placeholder="Where are you based?"
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading || !formData.displayName}
            >
              {isLoading ? 'Saving...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup; 