import type React from "react";
import { Container } from "react-bootstrap";

const Footer: React.FC = () => {
return <footer className="text-center">
<Container>
  <small>
    &copy; {new Date().getFullYear()} Rhythmix. All rights reserved. |{' '}
    <a href="/terms">Terms</a>{' '}
    |{' '}
    <a href="/privacy">Privacy</a>
  </small>
</Container>
</footer>
}

export default Footer;