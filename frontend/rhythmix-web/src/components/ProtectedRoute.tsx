import React from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../store/userAtom';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const [user] = useAtom(userAtom);  // Access the userAtom to check if user is logged in

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/" />;
  }

  // If user is authenticated, render the protected element (route)
  return <>{element}</>;
};

export default ProtectedRoute;
