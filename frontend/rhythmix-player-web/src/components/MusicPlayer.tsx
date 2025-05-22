import React, { useEffect, useRef, useState } from 'react';
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
  Spinner,
} from 'react-bootstrap';
import {
  FaPlay,
  FaPause,
  FaRedo,
  FaVolumeUp,
} from 'react-icons/fa';
import { FaShuffle, FaListUl, FaBackward, FaForward } from 'react-icons/fa6';
import { type LyricsLine, type SongMetadata } from '../music/model';
import LyricsList from './LyricsList';
import PlayQueue from './PlayQueue';
import {useMusicPlayerStore, type UseMusicPlayerStore} from 'container/musicPlayer';

const MusicPlayer: React.FC = () => {

  const queue = useMusicPlayerStore((state: UseMusicPlayerStore) => state.queue);
  const setVolume = useMusicPlayerStore((state: UseMusicPlayerStore) => state.setVolume);
  const isShuffling = useMusicPlayerStore((state: UseMusicPlayerStore) => state.isShuffling);
  const isRepeating = useMusicPlayerStore((state: UseMusicPlayerStore) => state.isRepeating);
  const isPlaying = useMusicPlayerStore((state: UseMusicPlayerStore) => state.isPlaying);
  const isLoading = useMusicPlayerStore((state: UseMusicPlayerStore) => state.isLoading);
  const seekTo = useMusicPlayerStore((state: UseMusicPlayerStore) => state.seekTo);
  const getCurrentSong = useMusicPlayerStore((state: UseMusicPlayerStore) => state.getCurrentSong);
  const togglePlayPause = useMusicPlayerStore((state:UseMusicPlayerStore) => state.togglePlayPause);
  const toggleShuffle = useMusicPlayerStore((state:UseMusicPlayerStore) => state.toggleShuffle);
  const getVolume = useMusicPlayerStore((state:UseMusicPlayerStore) => state.getVolume);
  const toggleRepeat = useMusicPlayerStore((state:UseMusicPlayerStore) => state.toggleRepeat);
  const getSeek = useMusicPlayerStore((state:UseMusicPlayerStore) => state.getSeek);
  const getCurrentSongDuration = useMusicPlayerStore((state:UseMusicPlayerStore) => state.getCurrentSongDuration);

  const playPreviousTrack = useMusicPlayerStore((state:UseMusicPlayerStore) => state.playPreviousTrack);
  const playNextTrack = useMusicPlayerStore((state:UseMusicPlayerStore) => state.playNextTrack);
  const currentTrackIndex = useMusicPlayerStore((state:UseMusicPlayerStore) => state.currentTrackIndex);


  const songMetadata:SongMetadata = getCurrentSong();
  const [playing, setIsPlaying] = useState(isPlaying);
  const [progress, setProgress] = useState(0);
  const duration = getCurrentSongDuration();
  const [currentLine, setCurrentLine] = useState(0);
  const [showQueue, setShowQueue] = useState(false);
  const [shuffle, setShuffle] = useState(isShuffling);
  const [repeat, setRepeat] = useState(isRepeating);
  const lyricRefs = useRef<Array<HTMLLIElement | null>>([]);
  const lyricsArray:LyricsLine[] = getCurrentSong().lyrics;

  // Update volume
  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
  };

  // Seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = duration ? pos * duration : 0;
    seekTo(time);
    setProgress(time);
  };

  // Progress Updater
  useEffect(() => {
    let iv: ReturnType<typeof setInterval>;;
    if (isPlaying) {
      // 1) kick it off immediately
      setProgress(getSeek());

      // 2) then poll more frequently
      iv = setInterval(() => {
        setProgress(getSeek());
      }, 100);    // ↓ shorter interval for smoother updates
    }

    return () => {
      if (iv) clearInterval(iv);
    };
  }, [isPlaying]);

  // Lyrics sync
  useEffect(() => {
    if (!isPlaying || !lyricsArray.length) return;
    let last = Date.now();
    const iv = setInterval(() => {
      const t = getSeek();
      let idx = lyricsArray.findIndex((l) => l.time > t) - 1;
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
              <ProgressBar now={(progress / (duration || 1)) * 100} className="mb-3" style={{ height: 6 }} />
            </div>
            <div className="d-flex justify-content-between small mb-3">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration || 0)}</span>
            </div>

            <div className="d-flex justify-content-center gap-3 mb-3">
              <OverlayTrigger overlay={<Tooltip>Shuffle</Tooltip>}>
                <Button className='btn-rounded-circle' variant={shuffle ? 'success' : 'outline-light'} onClick={() => {
                  setShuffle(!shuffle);
                  toggleShuffle();
                }}>
                  <FaShuffle />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip>Play Previous Track</Tooltip>}>
                <Button className='btn-rounded-circle' disabled={currentTrackIndex==0} variant={'outline-light'} onClick={() => {
                  playPreviousTrack()
                }}>
                  <FaBackward/>
                </Button>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip>{playing ? 'Pause' : 'Play'}</Tooltip>}>
                <Button disabled={isLoading} className='btn-rounded-circle' variant="light" onClick={() =>{
                  togglePlayPause();
                  setIsPlaying(!isPlaying);
                }}>
                  {isLoading ? <Spinner animation="border" size="sm" variant="light" /> : (isPlaying ? <FaPause /> : <FaPlay />)}  
                </Button>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip>Play Next Track</Tooltip>}>
                <Button className='btn-rounded-circle' disabled={queue.length == currentTrackIndex+1} variant={'outline-light'} onClick={() => {
                  playNextTrack()
                }}>
                  <FaForward/>
                </Button>
              </OverlayTrigger>
              <OverlayTrigger  overlay={<Tooltip>Repeat</Tooltip>}>
                <Button className='btn-rounded-circle' variant={repeat ? 'warning' : 'outline-light'} onClick={() => {
                  setRepeat(!repeat);
                  toggleRepeat();
                }}>
                  <FaRedo />
                </Button>
              </OverlayTrigger>
            </div>

            <Form.Group as={Row} className="align-items-center justify-content-center mb-4">
              <Col xs="auto">
                <FaVolumeUp />
              </Col>
              <Col className="mt-2">
                <Form.Range value={getVolume()} min={0} max={1} step={0.01} onChange={changeVolume} />
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
          show={showQueue}
          onHide={toggleQueue}
        />
      </Container>
    </Container>
  );
};

export default MusicPlayer;
