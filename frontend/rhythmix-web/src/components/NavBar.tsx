import type React from "react";
import { Container, Image, Nav, Navbar } from "react-bootstrap";
import imageSrc from "../assets/logo.png";

const NavBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      return <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
              <Container>
                <Navbar.Brand href="/"><Image src={imageSrc} width={40} height={40} fluid ></Image> Rhythmix</Navbar.Brand>
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