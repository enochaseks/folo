import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const functions = getFunctions(app);

// Action code settings for email verification and authentication
export const actionCodeSettings = {
  url: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000/login'
    : 'https://www.foloapp.co.uk/login',
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.folo.app'
  },
  android: {
    packageName: 'com.folo.app',
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: 'foloapp.co.uk'
};

// Initialize Firestore with error handling
let db;
try {
  db = getFirestore(app);
  // Enable offline persistence
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });
} catch (error) {
  console.error('Error initializing Firestore:', error);
  // You might want to show a user-friendly message here
}

export { db };
export const googleProvider = new GoogleAuthProvider();

// AI-powered authentication functions
export const analyzeUserBehavior = httpsCallable(functions, 'analyzeUserBehavior');
export const detectSuspiciousActivity = httpsCallable(functions, 'detectSuspiciousActivity');
export const generatePersonalizedSecurity = httpsCallable(functions, 'generatePersonalizedSecurity');

// Configure Google provider with all necessary parameters
googleProvider.setCustomParameters({
  prompt: 'select_account',
  redirect_uri: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000/__/auth/handler'
    : 'https://www.foloapp.co.uk/__/auth/handler'
});

// Add scopes for Google Sign-in
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Export email link authentication functions
export const sendEmailLink = async (email) => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending email link:', error);
    return { success: false, error: error.message };
  }
};

export const completeEmailSignIn = async (email, link) => {
  try {
    const result = await signInWithEmailLink(auth, email, link);
    window.localStorage.removeItem('emailForSignIn');
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Error completing email sign in:', error);
    return { success: false, error: error.message };
  }
};

export const isEmailLink = (link) => {
  if (!link) return false;
  return isSignInWithEmailLink(auth, link);
};

// Password authentication functions
export const createUserWithPassword = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Error creating user with password:', error);
    return { success: false, error: error.message };
  }
};

export const signInWithPassword = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Error signing in with password:', error);
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Password validation function
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!hasUpperCase) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!hasLowerCase) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!hasNumbers) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  if (!hasSpecialChar) {
    return { valid: false, error: 'Password must contain at least one special character' };
  }

  return { valid: true };
};

// Export email verification function
export const verifyEmail = async (user) => {
  try {
    await sendEmailVerification(user, actionCodeSettings);
    return { success: true };
  } catch (error) {
    console.error('Error sending email verification:', error);
    return { success: false, error: error.message };
  }
};