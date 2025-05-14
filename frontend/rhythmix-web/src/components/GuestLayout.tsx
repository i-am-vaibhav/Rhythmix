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
    <div>
      {/* Navigation Bar */}
      <NavBar logoLink='/' children={
        <>
          <Nav.Link onClick={() => navigate('/login')}><MdLogin/> Log In</Nav.Link>
          <Nav.Link onClick={() => navigate('/signup')}><MdCreate/> Sign Up</Nav.Link>
        </>
      } />
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={handleToastClose}
          show={notification}
          delay={5000}
          autohide
          bg="dark"
        >
          <Toast.Header className="bg-primary text-white">
            <strong className="me-auto">Notification!</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {loginMessage || signupMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      {/* Main Content */}
      <main style={{ paddingTop: '56px' }}>
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default GuestLayout;
