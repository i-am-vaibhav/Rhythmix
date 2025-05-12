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
  const addSongToQueue = useMusicPlayerStore(
    (state: UseMusicPlayerStore) => state.addSongToQueue
  );
  const playTrackSong = useMusicPlayerStore(
    (state: UseMusicPlayerStore) => state.playTrackSong
  );

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
            <Card className="music-card h-100 border-0 shadow-sm">
              <div className="position-relative image-container">
                <Card.Img
                  src={item.coverArt}
                  alt={item.title}
                  className="rounded-top"
                  style={{objectFit:'cover'}}
                />
                <Card.ImgOverlay className="overlay d-flex flex-column justify-content-center align-items-center">
                  <div className="m-2 d-flex opacity-75">
                    <Button
                      variant="light"
                      className="rounded-circle p-3 m-4 shadow-lg"
                      onClick={() => {
                        navigate('/player/music');
                        playTrackSong(item);
                      }}
                    >
                      <FaPlay />
                    </Button>
                    <Button
                      variant="light"
                      className="rounded-circle p-3 m-4 shadow-lg"
                      onClick={() => addSongToQueue(item)}
                    >
                      <FaPlus />
                    </Button>
                  </div>
                  <div className="text-center d-flex flex-column justify-content-between">
                    <div className="text-light mb-1 fs-6 text-truncate">
                      {item.title}
                    </div>
                    <div className="text-light small text-truncate">
                      {item.artist}
                    </div>
                </div>
                </Card.ImgOverlay>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default Dashboard;
