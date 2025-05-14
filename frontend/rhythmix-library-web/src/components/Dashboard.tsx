import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, ButtonGroup, Spinner, ListGroup } from 'react-bootstrap';
import { FaSearch, FaPlay } from 'react-icons/fa';
import FooterMusicPlayer from './FooterMusicPlayer';
import trackList from "container/MockedMusic";
import { useMusicPlayerStore, type UseMusicPlayerStore } from 'container/musicPlayer';
import { MdLibraryMusic } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa6';

const mockTracks = [ 
  ...trackList
];

const mockPlaylists = [
  { id: 'liked', name: 'Liked Songs', tracks: mockTracks },
  { id: 'playlist1', name: 'Chill Vibes', tracks: [mockTracks[0], mockTracks[5], mockTracks[6]] },
  { id: 'playlist2', name: 'Party Mix', tracks: [mockTracks[1], mockTracks[4], mockTracks[2],mockTracks[3]] },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedPlaylist, setSelectedPlaylist] = useState('liked');

  const playTrackSong = useMusicPlayerStore((state:UseMusicPlayerStore) => state.playTrackSong);

  const addSongToQueue = useMusicPlayerStore((state:UseMusicPlayerStore) => state.addSongToQueue);

  const clearQueue = useMusicPlayerStore((state:UseMusicPlayerStore) => state.clearQueue);

  const stop = useMusicPlayerStore((state:UseMusicPlayerStore) => state.stop);

  // Find currently selected playlist
  const currentPlaylist = mockPlaylists.find(pl => pl.id === selectedPlaylist) || mockPlaylists[0];

  // Filter tracks by search within playlist
  const displayedTracks = currentPlaylist.tracks.filter(
    track =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const playCurrentPlayList = () => {
    currentPlaylist.tracks.forEach((track) => {
      addSongToQueue(track);
    });
  }

  return (
    <Container fluid className="p-4 mb-5">
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
              <ButtonGroup>
                <Button value="grid" onClick={() => setViewMode('grid')} variant={viewMode == 'grid'?'primary':"outline-light"}>
                  Grid
                </Button>
                <Button value="list" onClick={() => setViewMode('list')} variant={viewMode == 'list'?'primary':"outline-light"}>
                  List
                </Button>
              </ButtonGroup>
            </Col>
          </Row>

          <Button
            variant="primary"
            className="shadow-lg mb-4"
            onClick={() => {
              clearQueue();
              stop();
              playCurrentPlayList();   
            }}
          >
            <FaPlay/> Play All
          </Button>
          {/* Tracks Display */}
          {viewMode === 'grid' ? (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {displayedTracks.length ? (
                displayedTracks.map((item) => (
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
                                playTrackSong(item);
                              }}
                            >
                              <FaPlay />
                            </Button>
                            <Button
                              variant="light"
                              className="rounded-circle p-3 m-4 shadow-lg"
                              onClick={() => addSongToQueue(item)}>
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
                      <div className="small text-truncate" style={{ maxWidth: 200 }}>
                        {track.artist}
                      </div>
                    </div>
                  </div>
                  <div className='ms-auto gap-2 d-flex'>
                    <Button variant="primary"
                      className="rounded-circle shadow-lg"
                      onClick={() => playTrackSong(track)}>
                      <FaPlay />
                    </Button>
                    <Button
                      variant="primary"
                      className="rounded-circle shadow-lg"
                      onClick={() => addSongToQueue(track)}>
                      <FaPlus />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {/* Recently Played */}
          <h2 className="mt-5 mb-3 text-light border-secondary border-bottom pb-2">
            Recently Played
          </h2>
          <Row xs={2} sm={3} md={4} lg={4} className="g-3">
            {mockTracks.slice(0, 4).map((item) => (
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
                            playTrackSong(item);
                          }}
                        >
                          <FaPlay />
                        </Button>
                        <Button
                          variant="light"
                          className="rounded-circle p-3 m-4 shadow-lg"
                          onClick={() => addSongToQueue(item)}>
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
        </Container>

        <Container>
          <FooterMusicPlayer musicPlayerNavigationUrl="/player/music" />
        </Container>
      </div>
    </Container>
  );
};

export default Dashboard;