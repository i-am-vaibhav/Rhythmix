// src/components/Dashboard.tsx
import React from 'react';
import { useAuthStore } from 'container/AuthStore';
import { Navigate } from 'react-router-dom';
import { Container, Row, Col, Card, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaSearch, FaPlay, FaPause, FaStepForward } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const {userData} = useAuthStore();
  if (!userData) return <Navigate to="/" />;

  // Mock data
  // src/mock/musicData.ts
  interface Track {
    id: string;
    title: string;
    artist: string;
    imgUrl: string;
  }

  const recent: Track[] = [
    {
      id: '1',
      title: 'Die with a Smile',
      artist: 'Lady Gaga & Bruno Mars',
      imgUrl: 'https://placehold.co/200x200?text=Die+with+a+Smile',
    },
    {
      id: '2',
      title: 'DTMF',
      artist: 'Bad Bunny',
      imgUrl: 'https://placehold.co/200x200?text=DTMF',
    },
    {
      id: '3',
      title: 'Luther',
      artist: 'Kendrick Lamar & SZA',
      imgUrl: 'https://placehold.co/200x200?text=Luther',
    },
  ];

  const recommended: Track[] = [
    {
      id: '4',
      title: 'Smile',
      artist: 'Morgan Wallen',
      imgUrl: 'https://placehold.co/200x200?text=Smile',
    },
    {
      id: '5',
      title: 'Pink Pony Club',
      artist: 'Chappell Roan',
      imgUrl: 'https://placehold.co/200x200?text=Pink+Pony+Club',
    },
    {
      id: '6',
      title: 'Gimme a Hug',
      artist: 'Drake',
      imgUrl: 'https://placehold.co/200x200?text=Gimme+a+Hug',
    },
  ];

  const newReleases: Track[] = [
    {
      id: '7',
      title: 'Evil J0rdan',
      artist: 'Playboi Carti',
      imgUrl: 'https://placehold.co/200x200?text=Evil+J0rdan',
    },
    {
      id: '8',
      title: 'Ordinary',
      artist: 'Alex Warren',
      imgUrl: 'https://placehold.co/200x200?text=Ordinary',
    },
    {
      id: '9',
      title: 'Anxiety',
      artist: 'Doechii',
      imgUrl: 'https://placehold.co/200x200?text=Anxiety',
    },
  ];


  return (
    <Container fluid className="p-3">
      {/* Greeting & Search */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Welcome back, {userData?.username}!</h3>
        <InputGroup style={{ maxWidth: 300 }}>
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <FormControl placeholder="Search music" aria-label="Search music"/>
        </InputGroup>
      </div>

      {/* Sections */}
      <Section title="Recently Played" items={recent} />
      <Section title="Recommended Playlists" items={recommended} grid />
      <Section title="New Releases" items={newReleases} grid />

      {/* Mini-Player */}
      <footer className="fixed-bottom bg-light border-top py-2 d-flex align-items-center">
        <img src="/path/to/cover.jpg" alt="cover" style={{ width: 50, height: 50 }} className="me-3 rounded" />
        <div className="flex-grow-1">
          <div>Song Title</div>
          <small>Artist Name</small>
        </div>
        <Button variant="link"><FaStepForward /></Button>
        <Button variant="link"><FaPause /></Button>
      </footer>
    </Container>
  );
};

interface SectionProps { title: string; items: any[]; grid?: boolean; }
const Section: React.FC<SectionProps> = ({ title, items, grid }) => (
  <div className="mb-5">
    <h5 className="mb-3">{title}</h5>
    <Row className={grid ? 'g-3' : 'flex-nowrap overflow-auto'}>
      {items.map(item => (
        <Col key={item.id} md={grid ? 3 : undefined} style={grid ? {} : { minWidth: 200 }}>
          <Card className="h-100">
            <div className="position-relative">
              <Card.Img src={item.imgUrl} alt={item.title} className="rounded-top" />
              <Button
                variant="light"
                className="position-absolute top-50 start-50 translate-middle p-2 opacity-75"
              ><FaPlay /></Button>
            </div>
            <Card.Body>
              <Card.Title className="mb-1">{item.title}</Card.Title>
              <Card.Text className="text-muted">{item.artist}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

export default Dashboard;
