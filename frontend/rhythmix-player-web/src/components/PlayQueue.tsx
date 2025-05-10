import React, { useState, useMemo } from 'react';
import {
  Offcanvas, ListGroup, Button, Badge,
  InputGroup, FormControl, Tabs, Tab,
  DropdownButton, Dropdown, ButtonGroup, Placeholder
} from 'react-bootstrap';
import { FaTrash, FaPlay } from 'react-icons/fa';
import type { SongMetadata } from '../music/model';

export interface PlayQueueProps {
  queue: SongMetadata[];
  loading: boolean;
  show: boolean;
  onHide: () => void;
  onClear: () => void;
  playTrack: (track: SongMetadata) => void;
  removeAt: (number: number) => void;
}

const PlayQueue: React.FC<PlayQueueProps> = ({
  queue, loading, show, onHide, onClear, playTrack, removeAt
}) => {
  // 1. Internal index state
  const [currentIndex, setCurrentIndex] = useState(0);

  // 2. Derive history/current/upcoming
  const history  = useMemo(() => queue.slice(0, currentIndex),     [queue, currentIndex]);
  const current  = queue[currentIndex]; 
  const upcoming = useMemo(() => queue.slice(currentIndex + 1),   [queue, currentIndex]);

  // 3. Handlers
  const playAt = (idx: number) => { setCurrentIndex(idx); playTrack(queue[idx]); };
  const next   = () => setCurrentIndex(i => (i >= queue.length - 1 ? 0 : i + 1));
  const prev   = () => setCurrentIndex(i => (i <= 0 ? queue.length - 1 : i - 1));

  const shuffleQueue = () => {
    const shuffledQueue = [...queue];
    for (let i = shuffledQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]];
    }
    setCurrentIndex(0); // Reset to the first track in the shuffled queue
    playTrack(shuffledQueue[0]); // Play the first track in the shuffled queue
  }
  const clearPlayed = () => {
    const updatedQueue = queue.slice(currentIndex); // Keep only the current and upcoming tracks
    setCurrentIndex(0); // Reset the index to the first track in the updated queue
    if (updatedQueue.length > 0) {
      playTrack(updatedQueue[0]); // Play the first track in the updated queue
    }
  }

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" data-bs-theme="dark">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Play Queue <Badge bg="secondary" pill>{queue.length}</Badge></Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="glass-card p-3">
        
        {/* Search */}
        <InputGroup className="mb-3">
          <FormControl placeholder="Search queue…" onChange={e => {/* filter logic */}} />
        </InputGroup>

        {/* Current Song */}
        {current && (
          <div className="mb-3 p-2 border rounded glass-dark text-light">
            <div className="small text-muted">Now Playing:</div>
            <div><strong>{current.title}</strong></div>
            {current.artist && <div className="text-muted">{current.artist}</div>}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultActiveKey="upcoming" className="mb-3">
          <Tab eventKey="history" title={`History (${history.length})`}>
            <ListGroup variant="flush">
              {history.map((t, i) => (
                <ListGroup.Item key={t.id} className="music-card mb-2 text-muted small">
                  {t.title} – {t.artist}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Tab>
          <Tab eventKey="upcoming" title={`Upcoming (${upcoming.length})`}>
            <ListGroup variant="flush">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <ListGroup.Item key={i} className="music-card mb-2">
                      <Placeholder as="div" animation="glow">
                        <Placeholder xs={6} /> <Placeholder xs={4} />
                      </Placeholder>
                    </ListGroup.Item>
                  ))
                : upcoming.map((t, idx) => (
                    <ListGroup.Item
                      key={t.id}
                      className="d-flex justify-content-between align-items-center music-card"
                    >
                      <div>
                        <strong>{t.title}</strong>
                        {t.artist && <div className="text-muted small">{t.artist}</div>}
                      </div>
                      <div>
                        <Button size="sm" variant="outline-light" className="me-2"
                                onClick={() => playAt(currentIndex + 1 + idx)}>
                          <FaPlay />
                        </Button>
                        <Button size="sm" variant="outline-danger"
                                onClick={() => removeAt(currentIndex + 1 + idx)}>
                          <FaTrash />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))
              }
            </ListGroup>
          </Tab>
        </Tabs>

        {/* Batch Actions */}
        <DropdownButton id="actions" title="Actions" variant="outline-light" size="sm" className="mb-2">
          <Dropdown.Item onClick={shuffleQueue}>Shuffle</Dropdown.Item>
          <Dropdown.Item onClick={clearPlayed}>Clear Played</Dropdown.Item>
        </DropdownButton>

        {/* Play Controls */}
        <ButtonGroup size="sm" className="mb-3">
          <Button onClick={prev}>Prev</Button>
          <Button onClick={next}>Next</Button>
        </ButtonGroup>

        {/* Clear Queue */}
        {queue.length > 0 && (
          <Button variant="danger" size="sm" className="w-100" onClick={onClear}>
            Clear Queue
          </Button>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default PlayQueue;
