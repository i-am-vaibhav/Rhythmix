import React from 'react';
import { Nav, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import { MdCreate, MdLogin } from 'react-icons/md';
import { useAuthStore } from '../store/authStore';

const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children })  => {
  const navigate = useNavigate();
  const {isLoggedOut, toggleLogoutFlag} = useAuthStore();

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
          onClose={toggleLogoutFlag}
          show={isLoggedOut}
          delay={5000}
          autohide
          bg="dark"
        >
          <Toast.Header className="bg-primary text-white">
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            You have logged out successfully
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
