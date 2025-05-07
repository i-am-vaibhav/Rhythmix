import type React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

const NavBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      return <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
              <Container>
                <Navbar.Brand href="/">Rhythmix</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                  <Nav className="ms-auto">
                    {children}
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>;
}

export default NavBar;