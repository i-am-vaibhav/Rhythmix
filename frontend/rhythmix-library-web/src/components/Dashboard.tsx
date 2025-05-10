import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, ToggleButtonGroup, ToggleButton, Navbar, ButtonGroup } from 'react-bootstrap';
import { FaSearch, FaPlay } from 'react-icons/fa';

const mockTracks = [
  { id: 1, title: 'Dream in Lo-fi', artist: 'Various Artists', cover: '/covers/lofi.jpg' },
  { id: 2, title: 'Chill Beats', artist: 'DJ Relax', cover: '/covers/chill.jpg' },
  { id: 3, title: 'Jazz Vibes', artist: 'Smooth Jazz Band', cover: '/covers/jazz.jpg' },
  { id: 4, title: 'Electro House', artist: 'Beat Master', cover: '/covers/electro.jpg' },
];

const mockPlaylists = [
  { id: 'liked', name: 'Liked Songs', tracks: mockTracks },
  { id: 'playlist1', name: 'Chill Vibes', tracks: [mockTracks[1], mockTracks[2]] },
  { id: 'playlist2', name: 'Party Mix', tracks: [mockTracks[0], mockTracks[3]] },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedPlaylist, setSelectedPlaylist] = useState('liked');

  // Find currently selected playlist
  const currentPlaylist = mockPlaylists.find(pl => pl.id === selectedPlaylist) || mockPlaylists[0];

  // Filter tracks by search within playlist
  const displayedTracks = currentPlaylist.tracks.filter(
    track =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-dark text-light" style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand className="text-light">My Music Library</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="py-4">
        {/* Playlists Selector */}
        <ButtonGroup className="mb-4">
          {mockPlaylists.map(pl => (
            <Button
              key={pl.id}
              variant={pl.id === selectedPlaylist ? 'primary' : 'outline-light'}
              onClick={() => setSelectedPlaylist(pl.id)}
            >
              {pl.name}
            </Button>
          ))}
        </ButtonGroup>

        {/* Search & View Controls */}
        <Row className="align-items-center mb-4">
          <Col md={8}>
            <InputGroup>
              <InputGroup.Text className="bg-secondary text-light border-0"><FaSearch /></InputGroup.Text>
              <Form.Control
                placeholder="Search tracks, artists..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-secondary text-light border-0"
              />
            </InputGroup>
          </Col>
          <Col md={4} className="text-md-end mt-3 mt-md-0">
            <ToggleButtonGroup
              type="radio"
              name="viewMode"
              value={viewMode}
              onChange={val => setViewMode(val)}
            >
              <ToggleButton id="grid-view" value="grid" variant="outline-light">
                Grid View
              </ToggleButton>
              <ToggleButton id="list-view" value="list" variant="outline-light">
                List View
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>

        {/* Tracks Display for Selected Playlist */}
        {viewMode === 'grid' ? (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {displayedTracks.map(track => (
              <Col key={track.id}>
                <Card bg="secondary" text="light" className="h-100">
                  <Card.Img variant="top" src={track.cover} style={{ height: '180px', objectFit: 'cover' }} />
                  <Card.Body>
                    <Card.Title className="text-truncate">{track.title}</Card.Title>
                    <Card.Text className="text-truncate">{track.artist}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="list-group">
            {displayedTracks.map(track => (
              <div
                key={track.id}
                className="list-group-item list-group-item-dark d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="rounded me-3"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                  <div>
                    <div className="fw-semibold text-truncate" style={{ maxWidth: '200px' }}>{track.title}</div>
                    <div className="text-muted text-truncate" style={{ maxWidth: '200px' }}>{track.artist}</div>
                  </div>
                </div>
                <Button variant="light">
                  <FaPlay />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Recently Played */}
        <h2 className="mt-5 mb-3 text-light">Recently Played</h2>
        <Row xs={2} sm={3} md={4} className="g-3">
          {mockTracks.slice(0, 4).map(track => (
            <Col key={track.id} className="d-flex">
              <Card bg="secondary" text="light" className="flex-fill d-flex">
                <Row className="g-0">
                  <Col xs={4}>
                    <Card.Img src={track.cover} style={{ height: '100%', objectFit: 'cover' }} />
                  </Col>
                  <Col xs={8} className="d-flex flex-column justify-content-center ps-3">
                    <Card.Title className="mb-0 text-truncate" style={{ fontSize: '1rem' }}>{track.title}</Card.Title>
                    <Card.Text className="mb-0 text-truncate" style={{ fontSize: '0.875rem' }}>{track.artist}</Card.Text>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;