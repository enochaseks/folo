import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import '../styles/AuthStyles.css';
import '../styles/global.css';
import logo from '../images/logo.png';
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { 
  auth, 
  googleProvider, 
  sendEmailLink, 
  isEmailLink, 
  completeEmailSignIn,
  signInWithPassword,
  resetPassword
} from './firebase';
import { 
  FacebookAuthProvider, 
  signInWithPopup,
  sendEmailVerification 
} from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from './firebase';

const Login = () => {
  const { user, isAuthenticating } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLogin, setIsPasswordLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Clear only specific items on component mount
  useEffect(() => {
    // Only clear authentication-related items
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("emailForSignIn");
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthenticating && user) {
      checkUserStatus();
    }
  }, [user, isAuthenticating, navigate]);

  const checkUserStatus = async () => {
    try {
      if (!user?.uid) return;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (!userData) return;

      // Store essential user data
      localStorage.setItem("userRole", userData.role || "buyer");
      localStorage.setItem("userData", JSON.stringify(userData));
      
      // Add small delay before navigation
      const navigateWithDelay = (path) => {
        setTimeout(() => {
          navigate(path);
        }, 300);
      };
      
      // Check onboarding status first
      if (!userData.onboardingComplete) {
        // For all users, start with age verification
        if (!userData.ageVerified) {
          navigateWithDelay('/onboarding/age-verification');
          return;
        }
        
        // After age verification, go to user type selection
        if (!userData.role) {
          navigateWithDelay('/onboarding/user-type');
          return;
        }
      }
      
      // For sellers: always require business ID verification on login
      if (userData.role === 'seller') {
        // If they don't have a business ID yet, send them to setup
        if (!userData.businessID) {
          navigateWithDelay('/onboarding/setup-business-id');
          return;
        }
        
        // Always redirect to verify business ID for sellers on login
        navigateWithDelay('/onboarding/verify-business-id');
        return;
      }
      
      // For buyers, go directly to profile
      if (userData.role === 'buyer') {
        navigateWithDelay('/profile');
        return;
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      setError("Failed to verify user status. Please try again.");
    }
  };

  const createNewUserDocument = async (userId, email) => {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        email,
        createdAt: new Date().toISOString(),
        onboardingComplete: false,
        onboardingStep: 'age-verification'
      });
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Check if this is a callback from email link
    if (isEmailLink(location.href)) {
      handleEmailLinkCallback();
    }
  }, [location]);

  const handleEmailLinkCallback = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Get the email from localStorage or prompt the user
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      if (!email) {
        throw new Error('Email is required to complete sign in');
      }

      const result = await completeEmailSignIn(email, location.href);
      
      if (result.success) {
        const idToken = await result.user.getIdToken();
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/firebase`, 
          { idToken }
        );
        
        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          
          // Check onboarding status
          const userDoc = await getDoc(doc(db, 'users', result.user.uid));
          const userData = userDoc.data();
          
          if (!userData?.onboardingComplete) {
            navigate('/onboarding/age-verification');
            return;
          }
          
          // Check seller verification status
          if (userData?.role === 'seller') {
            // If business ID not set up yet
            if (!userData?.businessID) {
              navigate('/onboarding/setup-business-id');
              return;
            }
            
            // If business ID set but not verified, always redirect to verification
            if (!userData?.businessIDVerified) {
              navigate('/onboarding/verify-business-id');
              return;
            }
          }
          
          navigate('/profile');
        } else {
          throw new Error("Failed to authenticate with backend");
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Email link sign in error:", error);
      setError(error.message || "Failed to complete sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    
    try {
      if (!formData.email) {
        throw new Error("Please enter your email");
      }

      if (isPasswordLogin) {
        if (!formData.password) {
          throw new Error("Please enter your password");
        }

        const result = await signInWithPassword(formData.email, formData.password);
        
        if (result.success) {
          // Check if email is verified
          if (!result.user.emailVerified) {
            setError("Please verify your email before logging in. Check your inbox for the verification link.");
            await sendEmailVerification(result.user);
            setMessage("A new verification email has been sent. Please check your inbox.");
            return;
          }

          try {
            // Get a fresh token
            const idToken = await result.user.getIdToken(true);
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://folo-backend.onrender.com';

            try {
              // Enhanced axios request with better error handling
              const response = await axios({
                method: 'post',
                url: `${backendUrl}/api/auth/firebase`,
                data: { idToken },
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${idToken}`
                },
                timeout: 10000
              });
              
              if (response.data.success) {
                localStorage.setItem("token", idToken);
                localStorage.setItem("refreshToken", result.user.refreshToken);
              }
            } catch (backendError) {
              console.log('Backend auth failed:', backendError.message);
              // Store tokens anyway to allow Firebase-only auth
              localStorage.setItem("token", idToken);
              localStorage.setItem("refreshToken", result.user.refreshToken);
            }

            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            if (!userDoc.exists()) {
              await createNewUserDocument(result.user.uid, result.user.email);
              navigate('/onboarding/age-verification');
              return;
            }

            const userData = userDoc.data();
            localStorage.setItem("userRole", userData?.role || "buyer");
            localStorage.setItem("userData", JSON.stringify(userData));

            // Check onboarding status first
            if (!userData?.onboardingComplete) {
              navigate('/onboarding/age-verification');
              return;
            }

            // For sellers: ALWAYS verify business ID on login
            if (userData?.role === 'seller') {
              if (!userData.businessID) {
                navigate('/onboarding/setup-business-id');
              } else {
                // Always go to verification for sellers
                navigate('/onboarding/verify-business-id');
              }
              return;
            }

            // Only buyers proceed to profile
            navigate('/profile');

          } catch (error) {
            console.error('Error during login:', error);
            setError("Failed to complete login. Please try again.");
          }
        } else {
          throw new Error(result.error);
        }
      } else {
        const result = await sendEmailLink(formData.email);
        if (result.success) {
          setMessage("Check your email for the login link!");
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      setError(error.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email address first");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const result = await resetPassword(formData.email);
      
      if (result.success) {
        setMessage("Password reset email sent! Please check your inbox.");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError(error.message || "Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setIsLoading(true);
      setError("");
      
      let result;
      if (provider === "google") {
        result = await signInWithPopup(auth, googleProvider);
      } else if (provider === "facebook") {
        result = await signInWithPopup(auth, new FacebookAuthProvider());
      }

      const idToken = await result.user.getIdToken();
      
      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document if it doesn't exist
        await createNewUserDocument(result.user.uid, result.user.email);
        navigate('/onboarding/age-verification');
        return;
      }
      
      try {
        // Try backend authentication
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/firebase`, 
          { idToken }
        );
        
        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
      } catch (backendError) {
        console.log('Backend auth failed, proceeding with Firebase auth only');
        localStorage.setItem("token", idToken);
        localStorage.setItem("refreshToken", result.user.refreshToken);
      }

      // Use checkUserStatus to handle navigation and data storage
      await checkUserStatus();

    } catch (error) {
      console.error("Social login error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError("Login was cancelled. Please try again.");
      } else if (error.code === 'auth/internal-error') {
        setError("Authentication error. Please try again or use a different login method.");
      } else {
        setError(error.message || "Social login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if already authenticated
  if (isAuthenticating) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null;
  }

  return (
    <div className="auth-container">
      <div className="background-slideshow">
        <div className="slide slide1"></div>
        <div className="slide slide2"></div>
        <div className="slide slide3"></div>
      </div>
      
      <div className="auth-content">
        <img src={logo} alt="Folo Logo" className="auth-logo" />
        <div className="auth-form">
          <h1>Login</h1>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {isPasswordLogin && (
              <div className="form-group">
                <label>Password:</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <button
                  type="button"
                  className="forgot-password"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>
            )}
            
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button
            type="button"
            className="auth-toggle"
            onClick={() => setIsPasswordLogin(!isPasswordLogin)}
            disabled={isLoading}
          >
            {isPasswordLogin 
              ? "Login with Email Link instead" 
              : "Login with Password instead"}
          </button>
          
          <div className="divider">
            <span>OR</span>
          </div>
          
          <div className="social-login-buttons">
            <button 
              className="social-btn google"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
            >
              <FaGoogle /> Continue with Google
            </button>
            
            <button 
              className="social-btn facebook"
              onClick={() => handleSocialLogin("facebook")}
              disabled={isLoading}
              style={{ backgroundColor: "#1877F2", color: "white" }}
            >
              <FaFacebook /> Continue with Facebook
            </button>
          </div>
          
          <p className="auth-link">
            Don&apos;t have an account? <Link to="/signup">Sign up here</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;