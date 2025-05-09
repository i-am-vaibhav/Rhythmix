import React, { useEffect, useRef, useState } from 'react';
import { Button, ProgressBar, Form, Offcanvas, ListGroup, Badge, Row, Col } from 'react-bootstrap';
import { FaPlay, FaPause, FaStop, FaVolumeUp, FaListUl, FaTrash } from 'react-icons/fa';
import { Howl } from 'howler';
import { FaShuffle } from 'react-icons/fa6';
import { mockAudioUrl, mockSongMetadata, type SongMetadata } from '../music/model';

const FooterMusicPlayer: React.FC = () => {
  const soundRef = useRef<Howl | null>(null);
  const [songMetadata, setSongMetadata] = useState<SongMetadata>(mockSongMetadata);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [queue, setQueue] = useState<SongMetadata[]>([mockSongMetadata]);

  const [showQueue, setShowQueue] = useState(false);
  const toggleQueue = () => setShowQueue(prev => !prev);

  const togglePlay = () => {
    const s = soundRef.current;
    if (!s) return;
    s.playing() ? s.pause() : s.play();
  };

  const stop = () => {
    soundRef.current?.stop();
    setProgress(0);
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundRef.current?.volume(newVolume);
  };

  const removeAt = (i: number) => setQueue(q => [...q.slice(0, i), ...q.slice(i + 1)]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    soundRef.current?.seek(newTime);
    setProgress(newTime);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      switch (e.code) {
        case 'Space': e.preventDefault(); togglePlay(); break;
        case 'ArrowRight': soundRef.current?.seek((soundRef.current?.seek() as number) + 10); break;
        case 'ArrowLeft': soundRef.current?.seek((soundRef.current?.seek() as number) - 10); break;
        case 'ArrowUp': setVolume(v => Math.min(1, v + 0.1)); break;
        case 'ArrowDown': setVolume(v => Math.max(0, v - 0.1)); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const sound = new Howl({
      src: [mockAudioUrl.mockSong],
      html5: true,
      volume,
      onplay: () => {
        setIsPlaying(true);
        setDuration(sound.duration());
        updateProgress();
      },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        const next = queue[0];
        setQueue(q => q.slice(1));
        if (next) {
          setSongMetadata(next);
        }
      }
    });

    soundRef.current = sound;

    return () => {
      sound.unload();
    };
  }, [songMetadata]);

  const updateProgress = () => {
    const interval = setInterval(() => {
      const s = soundRef.current;
      if (s?.playing()) {
        setProgress(s.seek() as number);
      }
    }, 500);
    soundRef.current?.on('stop', () => clearInterval(interval));
  };

  const formatTime = (t: number) =>
    isNaN(t) ? '0:00' : `${Math.floor(t / 60)}:${('0' + Math.floor(t % 60)).slice(-2)}`;

  return (
    <div
      role="region"
      aria-label="Footer Music Player"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100px',
        backgroundColor: '#111',
        color: 'white',
        zIndex: 1000,
        borderTop: '1px solid #333',
        padding: '10px 20px',
      }}
    >
      <Row className="align-items-center">
        <Col md={3} className="d-flex align-items-center">
          <img
            src={songMetadata.coverArt}
            alt="Cover"
            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, marginRight: 10 }}
          />
          <div>
            <strong>{songMetadata.title}</strong>
            <div className="text-primary small">{songMetadata.artist}</div>
          </div>
        </Col>
        <Col md={4}>
          <div onClick={handleSeek} style={{ cursor: 'pointer' }}>
            <ProgressBar now={(progress / duration) * 100} style={{ height: 6 }} />
            <div className="d-flex justify-content-between text-muted small mt-1">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </Col>
        <Col md={2} className="d-flex align-items-center justify-content-center">
          <Button variant={shuffle ? 'success' : 'outline-light'} onClick={() => setShuffle(!shuffle)} className="me-2">
            <FaShuffle />
          </Button>
          <Button variant="light" onClick={togglePlay} className="me-2">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </Button>
          <Button variant="danger" onClick={stop}>
            <FaStop />
          </Button>
        </Col>
        <Col md={2} className="d-flex align-items-center">
          <FaVolumeUp className="me-2" />
          <Form.Range value={volume} min={0} max={1} step={0.01} onChange={changeVolume} />
          <span className="ms-2">{Math.round(volume * 100)}%</span>
        </Col>
        <Col md={1} className="text-end">
          <Button variant="outline-light" onClick={toggleQueue}>
            <FaListUl />
            {queue.length > 0 && <Badge bg="danger" pill className="ms-1">{queue.length}</Badge>}
          </Button>
        </Col>
      </Row>

      {/* Play Queue */}
      <Offcanvas show={showQueue} onHide={toggleQueue} placement="bottom" backdrop={false}>
        <Offcanvas.Header closeButton className="bg-dark text-light">
          <Offcanvas.Title>Play Queue</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-dark text-light">
          <ListGroup variant="flush">
            {queue.map((song, idx) => (
              <ListGroup.Item key={idx} className="bg-dark text-light d-flex justify-content-between align-items-center">
                {song.title}
                <Button variant="outline-danger" size="sm" onClick={() => removeAt(idx)}>
                  <FaTrash />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {queue.length === 0 && <div className="text-center mt-3 text-muted">Queue is empty</div>}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default FooterMusicPlayer;