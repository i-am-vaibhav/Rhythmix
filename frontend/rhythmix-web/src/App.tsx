import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupStepOne from './components/SignupStepOne';
import SignupStepTwo from './components/SignupStepTwo';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import Home from './components/Home';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><LoginForm /></Layout>} />
        <Route path="/signup" element={<Layout><SignupStepOne /></Layout>} />
        <Route path="/signup-step-two" element={<Layout><SignupStepTwo /></Layout>} />
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute element={<Dashboard />} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
