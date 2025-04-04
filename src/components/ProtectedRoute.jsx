import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const ProtectedRoute = () => {
  const { user, isAuthenticating } = useContext(AuthContext);

  if (isAuthenticating) {
    return <div>Loading...</div>; // Or your custom loading component
  }

  if (!user) {
    // Redirect to login page with the return location
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;