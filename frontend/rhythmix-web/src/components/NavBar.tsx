import type React from "react";
import { Container, Image, Nav, Navbar } from "react-bootstrap";
import imageSrc from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC<{ logoLink: string; children: React.ReactNode }> = ({ logoLink, children }) => {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow-lg">
      <Container fluid className="px-4">
        <Navbar.Brand
          onClick={() => navigate(logoLink)}
          style={{ cursor: "pointer" }}
          className="d-flex align-items-center gap-2"
        >
          <Image
            src={imageSrc}
            width={40}
            height={40}
            alt="Logo"
            roundedCircle
            className="me-2"
          />
          <span className="fw-bold fs-5">Rhythmix</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            {children}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
