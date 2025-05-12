import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, ToggleButtonGroup, ToggleButton, ButtonGroup, Spinner, ListGroup } from 'react-bootstrap';
import { FaSearch, FaPlay } from 'react-icons/fa';
import FooterMusicPlayer from './FooterMusicPlayer';
import trackList from "container/MockedMusic";
import { useMusicPlayerStore, type UseMusicPlayerStore } from 'container/musicPlayer';
import { MdLibraryMusic } from 'react-icons/md';

const mockTracks = [ 
  ...trackList
];

const mockPlaylists = [
  { id: 'liked', name: 'Liked Songs', tracks: mockTracks },
  { id: 'playlist1', name: 'Chill Vibes', tracks: [mockTracks[1], mockTracks[2]] },
  { id: 'playlist2', name: 'Party Mix', tracks: [mockTracks[0], mockTracks[1]] },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedPlaylist, setSelectedPlaylist] = useState('liked');

  const playTrackSong = useMusicPlayerStore((state:UseMusicPlayerStore) => state.playTrackSong);

  // Find currently selected playlist
  const currentPlaylist = mockPlaylists.find(pl => pl.id === selectedPlaylist) || mockPlaylists[0];

  // Filter tracks by search within playlist
  const displayedTracks = currentPlaylist.tracks.filter(
    track =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="p-4">
      <div className="d-flex flex-column min-vh-100">
        <h3 className='text-light pt-3'><MdLibraryMusic/> Library</h3>
        {/* Main Content */}
        <Container fluid className="flex-grow-1 py-4">
          {/* Playlists Selector */}
          <div className="d-flex mb-4">
            <ButtonGroup>
              {mockPlaylists.map((pl) => (
                <Button
                  key={pl.id}
                  variant={pl.id === selectedPlaylist ? 'primary' : 'outline-light'}
                  onClick={() => setSelectedPlaylist(pl.id)}
                >
                  {pl.name}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          {/* Search & View Controls */}
          <Row className="align-items-center mb-4">
            <Col xs={12} md={8} className="mb-3 mb-md-0">
              <InputGroup>
                <InputGroup.Text className="border-0">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search tracks, artists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0"
                />
              </InputGroup>
            </Col>
            <Col xs={12} md={4} className="text-md-end">
              <ToggleButtonGroup
                type="radio"
                name="viewMode"
                value={viewMode}
                onChange={(val) => setViewMode(val)}
              >
                <ToggleButton id="grid-view" value="grid" variant="outline-light">
                  Grid
                </ToggleButton>
                <ToggleButton id="list-view" value="list" variant="outline-light">
                  List
                </ToggleButton>
              </ToggleButtonGroup>
            </Col>
          </Row>

          {/* Tracks Display */}
          {viewMode === 'grid' ? (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {displayedTracks.length ? (
                displayedTracks.map((track) => (
                  <Col key={track.id}>
                    <Card bg="dark" text="light" className="h-100 border-secondary hover-shadow">
                      <div className="ratio ratio-1x1">
                        <Card.Img
                          src={track.coverArt}
                          alt={track.title}
                          className="object-fit-cover"
                        />
                      </div>
                      <Card.Body>
                        <Card.Title className="text-truncate mb-1">
                          {track.title}
                        </Card.Title>
                        <Card.Text className="text-truncate">
                          {track.artist}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <div className="w-100 text-center py-5">
                  <Spinner animation="border" variant="light" />
                </div>
              )}
            </Row>
          ) : (
            <ListGroup variant="flush" >
              {displayedTracks.map((track) => (
                <ListGroup.Item
                  key={track.id}
                  className="bg-dark text-light d-flex justify-content-between align-items-center py-3 border-secondary rounded-2 mb-2"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={track.coverArt}
                      alt={track.title}
                      className="rounded me-3"
                      style={{ width: 60, height: 60, objectFit: 'cover' }}
                    />
                    <div>
                      <div className="fw-semibold text-truncate" style={{ maxWidth: 200 }}>
                        {track.title}
                      </div>
                      <div className="text-muted text-truncate" style={{ maxWidth: 200 }}>
                        {track.artist}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline-light" onClick={() => playTrackSong(track)}>
                    <FaPlay />
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {/* Recently Played */}
          <h2 className="mt-5 mb-3 text-light border-secondary border-bottom pb-2">
            Recently Played
          </h2>
          <Row xs={2} sm={3} md={4} lg={4} className="g-3">
            {mockTracks.slice(0, 4).map((track) => (
              <Col key={track.id} className="d-flex">
                <Card bg="dark" text="light" className="flex-fill border-secondary hover-shadow">
                  <Row className="g-0">
                    <Col xs={4} className="ratio ratio-1x1">
                      <Card.Img
                        src={track.coverArt}
                        alt={track.title}
                        className="object-fit-cover"
                      />
                    </Col>
                    <Col xs={8} className="d-flex flex-column justify-content-center ps-3">
                      <Card.Title className="mb-1 text-truncate" style={{ fontSize: '1rem' }}>
                        {track.title}
                      </Card.Title>
                      <Card.Text className="mb-0 text-truncate" style={{ fontSize: '0.875rem' }}>
                        {track.artist}
                      </Card.Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        <Container>
          <FooterMusicPlayer musicPlayerNavigationUrl="/player/music" />
        </Container>
      </div>
    </Container>
  );
};

export default Dashboard;