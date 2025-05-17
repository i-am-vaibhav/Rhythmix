import type React from "react";
import { Container } from "react-bootstrap";

const Footer: React.FC = () => {
return <footer className='footer-player'>
  <Container className='footer-inner-container mw-100 text-center'>
    <small>
      &copy; {new Date().getFullYear()} <strong>Rhythmix</strong>. All rights reserved.
      {' '}|{' '}
      <a href="/terms" className="text-decoration-none text-warning mx-1">
        Terms
      </a>
      |{' '}
      <a href="/privacy" className="text-decoration-none text-warning mx-1">
        Privacy
      </a>
    </small>
  </Container>
</footer>
}

export default Footer;