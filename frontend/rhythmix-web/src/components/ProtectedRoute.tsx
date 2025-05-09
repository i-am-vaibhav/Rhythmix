import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const {isAuthenticated} = useAuthStore();  // Access the userAtom to check if user is logged in

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // If user is authenticated, render the protected element (route)
  return <>{element}</>;
};

export default ProtectedRoute;
