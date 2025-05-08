import React, { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupStepOne from './components/SignupStepOne';
import SignupStepTwo from './components/SignupStepTwo';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import Home from './components/Home';
import GuestLayout from './components/GuestLayout';
import { Spinner } from 'react-bootstrap';

const HomeWebApp = lazy(() => import('home_web/App'));

const App: React.FC = () => {
  const guestLayout = (child: React.ReactNode) => (<GuestLayout>{child}</GuestLayout>);
  return (
    <Router>
      <Routes>
        <Route path="/" element={guestLayout(<Home />)} />
        <Route path="/login" element={guestLayout(<LoginForm />)} />
        <Route path="/signup" element={guestLayout(<SignupStepOne />)} />
        <Route path="/signup-step-two" element={guestLayout(<SignupStepTwo />)} />
        <Route path="/home/*" element={<ProtectedRoute element={
          <React.Suspense fallback={
            <Spinner animation="border" size="sm" role="status" aria-hidden="true"> Loading the rhythm...</Spinner>}>
            <HomeWebApp />
          </React.Suspense>} />} />
      </Routes>
    </Router>
  );
};

export default App;
