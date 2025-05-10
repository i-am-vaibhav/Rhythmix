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
import {
  mockLyrics,
  mockSongMetadata,
  type SongMetadata,
} from '../music/model';
import '../index.css'
import LyricsList from './LyricsList';
import PlayQueue from './PlayQueue';

// Memoize sorted lyrics
const useLyricsArray = (raw: Record<string,string>) =>
  useMemo(() => Object.entries(raw)
    .map(([time, text]) => ({ time: parseFloat(time), text }))
    .sort((a, b) => a.time - b.time)
  , [raw]);

const MusicPlayer: React.FC = () => {
  const soundRef = useRef<Howl | null>(null);
  const [songMetadata, setSongMetadata] = useState<SongMetadata>(mockSongMetadata);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [queue, setQueue] = useState<SongMetadata[]>([mockSongMetadata]);
  const lyricRefs = useRef<Array<HTMLLIElement | null>>([]);
  const lyricsArray = useLyricsArray(mockLyrics);

  const togglePlay = () => { const s = soundRef.current; if (!s) return; s.playing() ? s.pause() : s.play(); };
  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => setVolume(parseFloat(e.target.value));

  // Offcanvas queue state
  const [showQueue, setShowQueue] = useState(false);
  const toggleQueue = () => setShowQueue(prev => !prev);

  const createSound = (song: SongMetadata) => {
    const sound = new Howl({
      src: [song.url],
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
    return sound;
  }

  // Enqueue and play logic
  const playTrack = (song: SongMetadata) => {
    soundRef.current?.stop();
    const sound = createSound(song);
    soundRef.current = sound;
    sound.play();
  };

  const dequeue = () => {
    let next;
    setQueue(q => {
      next = q[0];
      return q.slice(1);
    });
    return next;
  };

  const removeAt = (i: number) => setQueue(q => [...q.slice(0, i), ...q.slice(i + 1)]);

  // Seek on progress click
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    soundRef.current?.seek(newTime);
    setProgress(newTime);
  };

  // Keyboard shortcuts
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
  }, [togglePlay]);

  // Initialize Howl
  useEffect(() => {
    const sound = createSound(songMetadata)

    soundRef.current = sound;

    return () => {
      sound.unload();
    };
  }, [songMetadata, repeat]);

  useEffect(() => { soundRef.current?.volume(volume); }, [volume]);

  const updateProgress = () => {
    const iv = setInterval(() => {
      const s = soundRef.current;
      if (s?.playing()) setProgress(s.seek() as number);
    }, 200);
    soundRef.current?.on('stop', () => clearInterval(iv));
  };

  // Sync lyrics
  useEffect(() => {
    if (!isPlaying || lyricsArray.length === 0) return;

    const intervalId = setInterval(() => {
      const currentPlaybackTime = progress;
      let activeIndex = -1;

      for (let i = 0; i < lyricsArray.length; i++) {
        if (lyricsArray[i].time <= currentPlaybackTime) {
          activeIndex = i;
        } else {
          break; // Since lyricsArray is sorted, we can break early
        }
      }

      if (activeIndex !== currentLine) {
        console.log('Current line index:', activeIndex, 'Time:', lyricsArray[activeIndex]?.time, 'Text:', lyricsArray[activeIndex]?.text);
        setCurrentLine(activeIndex);
        if (lyricRefs.current[activeIndex]) {
          lyricRefs.current[activeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
      console.log('Lyrics sync interval cleared.');
    };
  }, [progress, isPlaying, lyricsArray, currentLine]);

  const formatTime = (t: number) => isNaN(t) ? '0:00' : `${Math.floor(t/60)}:${('0'+Math.floor(t%60)).slice(-2)}`;

  return (
    <Container fluid className="p-0 player-container" style={{ '--cover-art': `url(${songMetadata.coverArt})` } as React.CSSProperties}>
      <Container className="inner-container h-100 d-flex flex-column justify-content-center align-items-center text-light gap-3 p-4">
        <Card className="player-card w-100 border-0" style={{ maxWidth: '720px' }}>
          <Card.Body>
            <Row>
              <Col>
                <Card.Img src={songMetadata.coverArt} className="rounded shadow mb-4 mx-auto" style={{ width:220, height:220, objectFit:'cover' }}/>
                <Card.Title className="fw-bold">{songMetadata.title}</Card.Title>
                <Card.Text className="text-secondary mb-3">{songMetadata.artist} — {songMetadata.album}</Card.Text>
              </Col>
              <Col>
                <LyricsList lyricsArray={lyricsArray} currentLine={currentLine}/>
              </Col>
            </Row>

              {/* Clickable ProgressBar */}
              <div onClick={handleSeek} style={{ width:'100%', cursor:'pointer' }}>
                <ProgressBar now={progress/duration*100} className="mb-3" style={{ height:6 }}/>
              </div>
              <div className="d-flex justify-content-between small mb-3"><span>{formatTime(progress)}</span><span>{formatTime(duration)}</span></div>

              {/* Controls with tooltips and animations */}
              <div className="d-flex justify-content-center gap-3 mb-3">
                {/** Tooltip wrapper **/}
                <OverlayTrigger overlay={<Tooltip>Shuffle</Tooltip>}>
                  <Button variant={shuffle?'success':'outline-light'} className="rounded-circle btn-rounded-circle" onClick={()=>setShuffle(s=>!s)} aria-pressed={shuffle}>
                    <FaShuffle/>
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip>{isPlaying?'Pause':'Play'}</Tooltip>}>
                  <Button variant="light" className="rounded-circle px-3 py-2 btn-rounded-circle" onClick={togglePlay}>
                    {isPlaying?<FaPause/>:<FaPlay/>}
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip>Repeat</Tooltip>}>
                  <Button variant={repeat?'warning':'outline-light'} className="rounded-circle btn-rounded-circle" onClick={()=>setRepeat(r=>!r)} aria-pressed={repeat}>
                    <FaRedo/>
                  </Button>
                </OverlayTrigger>
              </div>

              {/* Volume slider */}
              <Form.Group as={Row} className="align-items-center justify-content-center mb-4" >
                <Col xs="auto"><FaVolumeUp/></Col>
                <Col className='mt-2'><Form.Range className='w-25' style={{height:"none"}} value={volume} min={0} max={1} step={0.01} onChange={changeVolume}/></Col>
                <Col xs="auto" >
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

          {/* Play Queue Offcanvas */}
          <PlayQueue 
          queue={queue}
          show={showQueue}
          onHide={toggleQueue}
          onClear={() => setQueue([])}
          playTrack={playTrack}
          loading={false}
          removeAt={removeAt}
          />
        </Container>
      </Container>
  );
};

export default MusicPlayer;
