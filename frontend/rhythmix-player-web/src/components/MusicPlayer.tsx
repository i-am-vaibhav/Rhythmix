import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Howl } from 'howler';
import {
  Container,
  Button,
  Card,
  ProgressBar,
  Form,
  Row,
  Col,
  Badge,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import {
  FaPlay,
  FaPause,
  FaRedo,
  FaVolumeUp,
} from 'react-icons/fa';
import { FaShuffle, FaListUl } from 'react-icons/fa6';
import { type SongMetadata } from '../music/model';
import LyricsList from './LyricsList';
import PlayQueue from './PlayQueue';

interface MusicPlayerProps {
  queue: SongMetadata[];
  onQueueChange: (queue: SongMetadata[]) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ queue, onQueueChange }) => {
  const soundRef = useRef<Howl | null>(null);
  const [songMetadata, setSongMetadata] = useState<SongMetadata>(queue[0] || {});
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showQueue, setShowQueue] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const lyricRefs = useRef<Array<HTMLLIElement | null>>([]);
  const lyricsArray = useMemo(() => songMetadata.lyrics || [], [songMetadata]);

  const currentUrlRef = useRef<string | null>(null);

  // Create (or recreate) a Howl instance
  const createSound = (song: SongMetadata) => {
    // Unload previous Howl instance completely
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }

    // Omit html5:true so Howler uses Web Audio API by default
    const sound = new Howl({
      src: [song.url],
      volume,
      preload: true,               // Preload audio (metadata + data)
      onplay: () => {
        currentUrlRef.current = song.url;
        setIsPlaying(true);
        setDuration(sound.duration());
      },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        if (repeat) {
          sound.play();
        } else {
          const nextSong = dequeue();
          if (nextSong) {
            setSongMetadata(nextSong);
          } else {
            setIsPlaying(false);
          }
        }
      },
    });

    soundRef.current = sound;
    return sound;
  };

  // Play the given track, but only if it's not already playing
  const playTrack = (song: SongMetadata) => {
    if (song.url === currentUrlRef.current) return;
    setSongMetadata(song);
    createSound(song).play();
  };

  // Dequeue the next track
  const dequeue = () => {
    const [, ...rest] = queue;
    onQueueChange(rest);
    return queue[0];
  };

  // Remove arbitrary track from queue
  const removeAt = (i: number) => {
    const updated = [...queue.slice(0, i), ...queue.slice(i + 1)];
    onQueueChange(updated);
  };

  // Toggle play/pause
  const togglePlay = () => {
    const s = soundRef.current;
    if (!s) return;
    s.playing() ? s.pause() : s.play();
  };

  // Update volume
  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    soundRef.current?.volume(vol);
  };

  // Seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = pos * duration;
    soundRef.current?.seek(time);
    setProgress(time);
  };

  // Progress updater
  useEffect(() => {
    if (!isPlaying) return;
    const iv = setInterval(() => {
      if (soundRef.current?.playing()) {
        setProgress(soundRef.current.seek() as number);
      }
    }, 200);
    return () => clearInterval(iv);
  }, [isPlaying]);

  // Lyrics sync (throttled)
  useEffect(() => {
    if (!isPlaying || !lyricsArray.length) return;
    let last = Date.now();
    const iv = setInterval(() => {
      const t = soundRef.current?.seek() as number;
      let idx = lyricsArray.findIndex((l, i) => l.time > t) - 1;
      if (idx < 0) idx = lyricsArray.length - 1;
      if (idx !== currentLine && Date.now() - last > 250) {
        setCurrentLine(idx);
        lyricRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        last = Date.now();
      }
    }, 100);
    return () => clearInterval(iv);
  }, [isPlaying, lyricsArray, currentLine]);

  // Format seconds to m:ss
  const formatTime = (t: number) =>
    isNaN(t) ? '0:00' : `${Math.floor(t / 60)}:${('0' + Math.floor(t % 60)).slice(-2)}`;

  // When queue changes, only start new track if different
  useEffect(() => {
    if (queue.length && queue[0].url !== currentUrlRef.current) {
      playTrack(queue[0]);
    }
  }, [queue]);

  function toggleQueue(): void {
    setShowQueue((prev) => !prev);
  }
  return (
    <Container fluid className="p-0 player-container" style={{ '--cover-art': `url(${songMetadata.coverArt})` } as React.CSSProperties}>
      <Container className="inner-container h-100 d-flex flex-column justify-content-center align-items-center text-light gap-3 p-4">
        <Card className="player-card w-100 border-0" style={{ maxWidth: 720 }}>
          <Card.Body>
            <Row>
              <Col>
                <Card.Img
                  src={songMetadata.coverArt}
                  className="rounded shadow mb-4 mx-auto"
                  style={{ width: 220, height: 220, objectFit: 'cover' }}
                />
                <Card.Title className="fw-bold">{songMetadata.title}</Card.Title>
                <Card.Text className="text-secondary mb-3">
                  {songMetadata.artist} — {songMetadata.album}
                </Card.Text>
              </Col>
              <Col>
                <LyricsList lyricsArray={lyricsArray} currentLine={currentLine} />
              </Col>
            </Row>

            <div onClick={handleSeek} style={{ width: '100%', cursor: 'pointer' }}>
              <ProgressBar now={(progress / duration) * 100} className="mb-3" style={{ height: 6 }} />
            </div>
            <div className="d-flex justify-content-between small mb-3">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="d-flex justify-content-center gap-3 mb-3">
              <OverlayTrigger overlay={<Tooltip>Shuffle</Tooltip>}>
                <Button variant={shuffle ? 'success' : 'outline-light'} onClick={() => setShuffle(!shuffle)}>
                  <FaShuffle />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip>{isPlaying ? 'Pause' : 'Play'}</Tooltip>}>
                <Button variant="light" onClick={togglePlay}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </Button>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip>Repeat</Tooltip>}>
                <Button variant={repeat ? 'warning' : 'outline-light'} onClick={() => setRepeat(!repeat)}>
                  <FaRedo />
                </Button>
              </OverlayTrigger>
            </div>

            <Form.Group as={Row} className="align-items-center justify-content-center mb-4">
              <Col xs="auto">
                <FaVolumeUp />
              </Col>
              <Col className="mt-2">
                <Form.Range value={volume} min={0} max={1} step={0.01} onChange={changeVolume} />
              </Col>
              <Col xs="auto">
                <OverlayTrigger overlay={<Tooltip>Show Play Queue</Tooltip>}>
                    <Button variant="outline-info" className="position-relative mb-3 btn-rounded-circle" onClick={toggleQueue}>
                      <FaListUl className="me-1"/>
                      {queue.length>0 && <Badge bg="danger" pill>{queue.length}</Badge>}
                  </Button>
                </OverlayTrigger>
              </Col>
            </Form.Group>
          </Card.Body>
        </Card>

        <PlayQueue
          queue={queue}
          show={showQueue}
          onHide={toggleQueue}
          onClear={() => onQueueChange([])}
          playTrack={playTrack}
          loading={false}
          removeAt={removeAt}
        />
      </Container>
    </Container>
  );
};

export default MusicPlayer;
