import React from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children })  => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navigation Bar */}
      <NavBar children={
        <>
          <Nav.Link onClick={() => navigate('/login')}>Log In</Nav.Link>
          <Nav.Link onClick={() => navigate('/signup')}>Sign Up</Nav.Link>
        </>
      } />

      {/* Main Content */}
      <main style={{ paddingTop: '56px' }}>
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
