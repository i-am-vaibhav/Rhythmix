import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaMusic, FaMobileAlt, FaHeadphones } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <div
        className="d-flex align-items-center justify-content-center text-white text-center"
        style={{
          backgroundImage: 'url(/images/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          paddingTop: '56px', // To offset the fixed navbar
        }}
      >
        <Container>
          <h1 className="display-4 fw-bold text-primary">Feel the Rhythm</h1>
          <p className="lead">Experience music like never before with personalized playlists and high-quality streaming.</p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button variant="outline-light" size="lg" onClick={() => navigate('/signup')}>
              Get Started
            </Button>
            <Button variant="light" size="lg" onClick={() => navigate('/login')}>
              Log In
            </Button>
          </div>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="text-center">
          <Col md={4} className="mb-4">
            <FaMusic size={40} className="mb-3 text-primary" />
            <h5>Personalized Playlists</h5>
            <p>Discover music tailored to your taste.</p>
          </Col>
          <Col md={4} className="mb-4">
            <FaMobileAlt size={40} className="mb-3 text-primary" />
            <h5>Available on All Devices</h5>
            <p>Listen to your favorite tracks anywhere, anytime.</p>
          </Col>
          <Col md={4} className="mb-4">
            <FaHeadphones size={40} className="mb-3 text-primary" />
            <h5>High-Quality Audio</h5>
            <p>Experience music in crystal clear quality.</p>
          </Col>
        </Row>
      </Container>
      
      
    </div>
  );
};

export default Home;
