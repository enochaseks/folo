import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import { Link } from "react-router-dom";

const Profile = ({ services, addService, deletedServices, restoreService, permanentlyDeleteService, deleteService }) => {
  const { user, logout, updateRole, authAxios } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    mobileNumber: "+44 7888 227509",
    email: user?.email || "",
    dateOfBirth: "-",
    gender: "-",
  });
  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem("profilePicture") || "https://via.placeholder.com/150x150"
  );
  const [backgroundImage, setBackgroundImage] = useState(
    localStorage.getItem("backgroundImage") || "https://via.placeholder.com/800x200"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSeller, setIsSeller] = useState(user?.role === "seller");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const savedProfileDetails = localStorage.getItem("profileDetails");
    if (savedProfileDetails) {
      setProfile(JSON.parse(savedProfileDetails));
    }
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setIsSeller(savedRole === "seller");
    }
  }, []);

  useEffect(() => {
    if (user && !user.onboardingComplete) {
      checkOnboardingStatus();
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      const response = await authAxios.get('/api/users/onboarding-status');
      if (!response.data.data.onboardingComplete) {
        navigate('/onboarding/age-verification');
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newProfilePicture = event.target.result;
        setProfilePicture(newProfilePicture);
        localStorage.setItem("profilePicture", newProfilePicture);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newBackgroundImage = event.target.result;
        setBackgroundImage(newBackgroundImage);
        localStorage.setItem("backgroundImage", newBackgroundImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedProfile = { ...profile, [name]: value };
    setProfile(updatedProfile);
    localStorage.setItem("profileDetails", JSON.stringify(updatedProfile));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleRoleToggle = () => {
    const newRole = isSeller ? "buyer" : "seller";
    setIsSeller(!isSeller);
    updateRole(newRole);
    localStorage.setItem("userRole", newRole);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-background">
        <img src={backgroundImage} alt="Background" className="background-image" />
        <label htmlFor="background-upload" className="edit-background">Edit Background</label>
        <input id="background-upload" type="file" accept="image/*" onChange={handleBackgroundImageChange} style={{ display: "none" }} />
      </div>
      <div className="profile-content">
        <div className="profile-picture-container">
          <img src={profilePicture} alt="Profile" className="profile-picture" />
          <span className={`online-status ${isOnline ? "online" : "offline"}`}></span>
          {user?.role && (
            <div style={{
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: isSeller ? "blue" : "green",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              fontSize: "0.9rem",
              textTransform: "capitalize",
              width: "80px",
              textAlign: "center",
            }}>
              {isSeller ? "Seller" : "Buyer"}
            </div>
          )}
          <label htmlFor="profile-upload" className="edit-profile-picture">Edit</label>
          <input id="profile-upload" type="file" accept="image/*" onChange={handleProfilePictureChange} style={{ display: "none" }} />
        </div>
        <div className="profile-container">
          <Link to="/settings" className="settings-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
        </div>
        {user && <p className="welcome-message">Welcome, {user.name}!</p>}
        <div className="role-toggle">
          <label>
            <input type="checkbox" checked={isSeller} onChange={handleRoleToggle} />
            Switch to {isSeller ? "Buyer" : "Seller"}
          </label>
        </div>
        <div className="profile-details">
          <p>
            <strong>First Name:</strong>
            {isEditing ? (
              <input type="text" name="firstName" value={profile.firstName} onChange={handleInputChange} className="editable-input" />
            ) : (
              <span>{profile.firstName}</span>
            )}
          </p>
          <p>
            <strong>Last Name:</strong>
            {isEditing ? (
              <input type="text" name="lastName" value={profile.lastName} onChange={handleInputChange} className="editable-input" />
            ) : (
              <span>{profile.lastName}</span>
            )}
          </p>
          <p>
            <strong>Mobile Number:</strong>
            {isEditing ? (
              <input type="text" name="mobileNumber" value={profile.mobileNumber} onChange={handleInputChange} className="editable-input" />
            ) : (
              <span>{profile.mobileNumber}</span>
            )}
          </p>
          <p>
            <strong>Email:</strong>
            {isEditing ? (
              <input type="email" name="email" value={profile.email} onChange={handleInputChange} className="editable-input" />
            ) : (
              <span>{profile.email}</span>
            )}
          </p>
          <p>
            <strong>Date of Birth:</strong>
            {isEditing ? (
              <input type="text" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleInputChange} className="editable-input" />
            ) : (
              <span>{profile.dateOfBirth}</span>
            )}
          </p>
          <p>
            <strong>Gender:</strong>
            {isEditing ? (
              <input type="text" name="gender" value={profile.gender} onChange={handleInputChange} className="editable-input" />
            ) : (
              <span>{profile.gender}</span>
            )}
          </p>
        </div>
        <div className="dashboard">
          <div className="dashboard-buttons">
            {isSeller && (
              <button className="dashboard-btn create-service" onClick={() => navigate("/create-service")}>
                Create A Service
              </button>
            )}
            {isSeller && (
              <button className="dashboard-btn sales-trend" onClick={() => navigate("/sales-trend")}>
                Sales Trend
              </button>
            )}
            {isSeller && (
              <button className="dashboard-btn notifications-btn" onClick={() => navigate("/notifications")}>
                Notifications
              </button>
            )}
            {!isSeller && (
              <button className="dashboard-btn purchase-history" onClick={() => navigate("/purchase-history")}>
                Purchase History
              </button>
            )}
            {!isSeller && (
              <button className="dashboard-btn bookings" onClick={() => navigate("/bookings")}>
                Bookings
              </button>
            )}
          </div>
        </div>
        {isSeller && (
          <div className="deleted-services">
            <h2>Deleted Services</h2>
            {deletedServices.map((service) => (
              <div key={service.id} className="deleted-service">
                <h3>{service.category}</h3>
                {service.location && (
                  <p>
                    Location: Latitude {service.location.latitude}, Longitude {service.location.longitude}
                  </p>
                )}
                <p>Phone: {service.phone}</p>
                <p>Email: {service.email}</p>
                <div className="service-photos">
                  {service.photos.map((photo, index) => (
                    <img key={index} src={photo} alt={`Service Photo ${index}`} style={{ width: "100px", height: "100px", margin: "5px" }} />
                  ))}
                </div>
                <div className="service-items">
                  <h4>Items</h4>
                  {service.items.map((item, index) => (
                    <div key={index} className="item">
                      {item.photo && (
                        <img src={item.photo} alt={item.name} style={{ width: "50px", height: "50px", marginRight: "10px" }} />
                      )}
                      <p>{item.name} - ${item.price}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => restoreService(service.id)}>Restore</button>
                <button onClick={() => permanentlyDeleteService(service.id)}>Permanently Delete</button>
              </div>
            ))}
          </div>
        )}
        <div className="profile-actions">
          <button onClick={toggleEditMode} className="edit-button">
            {isEditing ? "Save" : "Edit"}
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {
  services: PropTypes.array.isRequired,
  addService: PropTypes.func.isRequired,
  deletedServices: PropTypes.array.isRequired,
  restoreService: PropTypes.func.isRequired,
  permanentlyDeleteService: PropTypes.func.isRequired,
  deleteService: PropTypes.func.isRequired,
};

export default Profile;