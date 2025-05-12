// src/components/Dashboard.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuthStore } from 'container/AuthStore';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap';
import { FaSearch, FaPlay, FaPlus } from 'react-icons/fa';
import type { SongMetadata } from '../model';
import { useMusicPlayerStore, type UseMusicPlayerStore } from 'container/musicPlayer';

interface DashboardProps {
  queue: SongMetadata[];
}

const Dashboard: React.FC<DashboardProps> = ({ queue }) => {
  const { userData } = useAuthStore();
  if (!userData) return <Navigate to="/" />;

  const recent: SongMetadata[] = [...queue];
  const recommended: SongMetadata[] = [...queue];
  const newReleases: SongMetadata[] = [...queue];

  return (
    <Container fluid className="p-4">
      {/* Greeting & Search */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Welcome back, {userData.username}!</h3>
        <InputGroup style={{ maxWidth: 300 }}>
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <FormControl placeholder="Search music" aria-label="Search music" />
        </InputGroup>
      </div>

      {/* Sections */}
      <Section title="Recently Played" items={recent} />
      <Section title="Recommended Playlists" items={recommended} grid />
      <Section title="New Releases" items={newReleases} grid />
    </Container>
  );
};

interface SectionProps {
  title: string;
  items: SongMetadata[];
  grid?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, items, grid }) => {
  const navigate = useNavigate();
  const addSongToQueue = useMusicPlayerStore((state: UseMusicPlayerStore) => state.addSongToQueue);
  const playTrackSong = useMusicPlayerStore((state: UseMusicPlayerStore) => state.playTrackSong);

  return (
    <section className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">{title}</h5>
      </div>
      <Row
        className={
          grid
            ? 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4'
            : 'flex-nowrap overflow-auto'
        }
      >
        {items.map((item) => (
          <Col key={item.id} className="d-flex">
            <Card className="h-100 shadow-sm border-0 hover-shadow transition">
              <div className="position-relative">
                <Card.Img
                  src={item.coverArt}
                  alt={item.title}
                  className="rounded-top"
                  style={{ height: '180px', objectFit: 'cover' }}
                />

                <div className="position-absolute top-50 start-50 translate-middle d-flex gap-2">
                  <Button
                    variant="light"
                    className="rounded-circle p-2 shadow"
                    onClick={() => {
                      navigate('/player/music');
                      playTrackSong(item);
                    }}
                  >
                    <FaPlay />
                  </Button>
                  <Button
                    variant="light"
                    className="rounded-circle p-2 shadow"
                    onClick={() => addSongToQueue(item)}
                  >
                    <FaPlus />
                  </Button>
                </div>
              </div>

              <Card.Body className="text-center d-flex flex-column justify-content-between">
                <div>
                  <Card.Title className="mb-1 fs-6 text-truncate">
                    {item.title}
                  </Card.Title>
                  <Card.Text className="text-muted small text-truncate">
                    {item.artist}
                  </Card.Text>
                </div>
                <Button variant="primary" size="sm" className="mt-2">
                  Play Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default Dashboard;
