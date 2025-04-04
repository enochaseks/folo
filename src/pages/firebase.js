import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

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

// Email link authentication settings
export const actionCodeSettings = {
  url: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://www.foloapp.co.uk',
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.folo.app'
  },
  android: {
    packageName: 'com.folo.app',
    installApp: true,
    minimumVersion: '12'
  }
};

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