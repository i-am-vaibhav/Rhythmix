import React, { useMemo } from 'react';
import {
  Offcanvas, ListGroup, Button, Badge,
  InputGroup, FormControl, Tabs, Tab,
  DropdownButton, Dropdown, ButtonGroup
} from 'react-bootstrap';
import { FaTrash, FaPlay } from 'react-icons/fa';
import { useMusicPlayerStore, type UseMusicPlayerStore } from 'container/musicPlayer';
import { useNavigate } from 'react-router-dom';

const PlayQueue: React.FC<{ show: boolean; onHide: () => void }> = ({ show, onHide }) => {
  const navigate = useNavigate();
  const queue = useMusicPlayerStore((state:UseMusicPlayerStore) => state.queue);
  const currentTrackIndex = useMusicPlayerStore((state:UseMusicPlayerStore) => state.currentTrackIndex);
  const playTrack = useMusicPlayerStore((state:UseMusicPlayerStore) => state.playTrackAt);
  const removeSongFromQueue = useMusicPlayerStore((state:UseMusicPlayerStore) => state.removeSongFromQueue);
  const addSongToQueue = useMusicPlayerStore((state:UseMusicPlayerStore) => state.addSongToQueue);
  const clearQueue = useMusicPlayerStore((state:UseMusicPlayerStore) => state.clearQueue);
  const playPreviousTrack = useMusicPlayerStore((state:UseMusicPlayerStore) => state.playPreviousTrack);
  const playNextTrack = useMusicPlayerStore((state:UseMusicPlayerStore) => state.playNextTrack);

  const history = useMemo(() => queue.slice(0, currentTrackIndex), [queue, currentTrackIndex]);
  const current = queue[currentTrackIndex];
  const upcoming = useMemo(() => queue.slice(currentTrackIndex + 1), [queue, currentTrackIndex]);

  const shuffleQueue = () => {
    const shuffled = [...queue];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Clear and re-add to maintain shuffle effect
    clearQueue();
    shuffled.forEach((song) => addSongToQueue(song));
    playTrack(0);
  };

  const clearPlayed = () => {
    const upcomingTracks = queue.slice(currentTrackIndex);
    clearQueue();
    upcomingTracks.forEach((song) => addSongToQueue(song));
    playTrack(0);
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" data-bs-theme="dark">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          Play Queue <Badge bg="secondary" pill>{queue.length}</Badge>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="glass-card p-3">
        <InputGroup className="mb-3">
          <FormControl placeholder="Search queue…" />
        </InputGroup>

        {current && (
          <div className="mb-3 p-2 border rounded glass-dark text-light">
            <div className="small text-muted">Now Playing:</div>
            <div><strong>{current.title}</strong></div>
            {current.artist && <div className="text-muted">{current.artist}</div>}
          </div>
        )}

        <Tabs defaultActiveKey="upcoming" className="mb-3">
          <Tab eventKey="history" title={`History (${history.length})`}>
            <ListGroup variant="flush">
              {history.map((t) => (
                <ListGroup.Item key={t.id} className="music-card mb-2 text-muted small">
                  {t.title} – {t.artist}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Tab>
          <Tab eventKey="upcoming" title={`Upcoming (${upcoming.length})`}>
            <ListGroup variant="flush">
              {upcoming.map((t, idx) => (
                <ListGroup.Item key={t.id} className="d-flex justify-content-between align-items-center music-card">
                  <div>
                    <strong>{t.title}</strong>
                    {t.artist && <div className="text-muted small">{t.artist}</div>}
                  </div>
                  <div>
                    <Button size="sm" variant="outline-light" className="me-2"
                      onClick={() => playTrack(currentTrackIndex + 1 + idx)}>
                      <FaPlay />
                    </Button>
                    <Button size="sm" variant="outline-danger"
                      onClick={() => removeSongFromQueue(t.id!)}>
                      <FaTrash />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Tab>
        </Tabs>

        <DropdownButton id="actions" title="Actions" variant="outline-light" size="sm" className="mb-2">
          <Dropdown.Item onClick={shuffleQueue}>Shuffle</Dropdown.Item>
          <Dropdown.Item onClick={clearPlayed}>Clear Played</Dropdown.Item>
        </DropdownButton>

        <ButtonGroup size="sm" className="mb-3">
          <Button onClick={playPreviousTrack}>Prev</Button>
          <Button onClick={playNextTrack}>Next</Button>
        </ButtonGroup>

        {queue.length > 0 && (
          <Button variant="danger" size="sm" className="w-100" onClick={()=>{
            clearQueue();
            navigate("/home/dashboard");
          }}>
            Clear Queue
          </Button>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default PlayQueue;