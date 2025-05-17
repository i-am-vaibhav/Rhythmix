import React, { useEffect, useState } from 'react';
import { Nav, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import { MdCreate, MdLogin } from 'react-icons/md';
import { useAuthStore } from '../store/authStore';
import { useSignupStore } from '../store/signupStore';

const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children })  => {
  const navigate = useNavigate();
  const loginMessage = useAuthStore((state) => state.message);
  const signupMessage = useSignupStore((state) => state.message);
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    if (loginMessage || signupMessage) {
      setNotification(true);
    }
  }, [loginMessage, signupMessage]);

  const handleToastClose = () => {
    setNotification(false);
    useAuthStore.setState({ message: '' });
    useSignupStore.setState({ message: '' });
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      {/* Navigation Bar */}
      <NavBar
        logoLink="/"
        children={
          <>
            <Nav.Link onClick={() => navigate('/login')} className="d-flex align-items-center gap-1 text-white">
              <MdLogin /> Log In
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/signup')} className="d-flex align-items-center gap-1 text-white">
              <MdCreate /> Sign Up
            </Nav.Link>
          </>
        }
      />

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3 mt-5" style={{ zIndex: 1055 }}>
        <Toast
          onClose={handleToastClose}
          show={notification}
          delay={5000}
          autohide
          bg="dark"
          className="shadow-lg rounded-3"
        >
          <Toast.Header closeButton={true} className="bg-primary text-white rounded-top-3">
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{loginMessage || signupMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Main Content */}
      <main className="flex-grow-1" style={{ paddingTop: '54px' }}>
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>

  );
}

export default GuestLayout;
