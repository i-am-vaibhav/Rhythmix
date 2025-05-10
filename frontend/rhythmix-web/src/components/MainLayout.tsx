import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import { FaHome } from 'react-icons/fa';
import { MdLibraryMusic, MdLogout } from "react-icons/md";
import { Nav, } from 'react-bootstrap';
import { useAuthStore } from '../store/authStore';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children })  => {
  const navigate = useNavigate();
  const {toggleLogoutFlag, logout} = useAuthStore(); 

  function handleLogout(): void {
    navigate('/'); 
    toggleLogoutFlag();
    logout();
  }

  return (
    <div>
      {/* Navigation Bar */}
      <NavBar logoLink='/home/dashboard' children={
        <>
          <Nav.Link onClick={() => navigate('/home/dashboard')}><FaHome/> Home</Nav.Link>
          <Nav.Link onClick={() => navigate('/library/dashboard')}><MdLibraryMusic /> Library</Nav.Link>
          <Nav.Link onClick={() => handleLogout()}><MdLogout/> Logout</Nav.Link>
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

export default MainLayout;
