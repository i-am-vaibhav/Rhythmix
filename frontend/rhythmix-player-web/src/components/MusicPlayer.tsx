import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Howl } from 'howler';
import {
  Container,
  Button,
  Card,
  ProgressBar,
  Form,
  ListGroup,
  Row,
  Col,
  Offcanvas,
  Badge,
  Accordion,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import {
  FaPlay,
  FaPause,
  FaStop,
  FaRedo,
  FaVolumeUp,
  FaTrash,
} from 'react-icons/fa';
import { FaShuffle, FaListUl, FaMusic } from 'react-icons/fa6';
import {
  mockAudioUrl,
  mockLyrics,
  mockSongMetadata,
  type SongMetadata,
} from '../music/model';

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
  const stop = () => { soundRef.current?.stop(); setProgress(0); };
  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => setVolume(parseFloat(e.target.value));

  // Offcanvas queue state
  const [showQueue, setShowQueue] = useState(false);
  const toggleQueue = () => setShowQueue(prev => !prev);

  // Drag-and-drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const handleDragStart = (i: number) => setDraggedIndex(i);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (i: number) => {
    if (draggedIndex === null || draggedIndex === i) return;
    setQueue(q => {
      const arr = [...q];
      const [m] = arr.splice(draggedIndex, 1);
      arr.splice(i, 0, m);
      return arr;
    });
    setDraggedIndex(null);
  };

  // Enqueue and play logic
  const enqueueAndPlay = (song: SongMetadata) => {
    setQueue(q => {
      const newQ = [...q, song];
      if (!soundRef.current || !soundRef.current.playing()) setSongMetadata(song);
      return newQ;
    });
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
    if (!isPlaying) return;
    const iv = setInterval(() => {
      const idx = lyricsArray.reduce((p, line, i) => line.time <= progress ? i : p, 0);
      setCurrentLine(idx);
      lyricRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
    return () => clearInterval(iv);
  }, [progress, isPlaying, lyricsArray]);

  const formatTime = (t: number) => isNaN(t) ? '0:00' : `${Math.floor(t/60)}:${('0'+Math.floor(t%60)).slice(-2)}`;

  return (
    <div role="region" aria-label="Music player" style={{ background: `url(${songMetadata.coverArt}) center/cover`, height: '100vh', position: 'relative' }}>
      <div style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.85)', width:'100%', height:'100%' }}>
        <Container className="h-100 d-flex flex-column justify-content-center align-items-center text-light">
          <Card bg="dark" text="light" className="w-100 border-0" style={{ maxWidth:720 }}>
            <Card.Body>
              <Card.Img src={songMetadata.coverArt} className="rounded shadow mb-4 mx-auto" style={{ width:220, height:220, objectFit:'cover' }}/>
              <Card.Title className="fw-bold">{songMetadata.title}</Card.Title>
              <Card.Text className="text-muted mb-3">{songMetadata.artist} — {songMetadata.album}</Card.Text>

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
                <OverlayTrigger overlay={<Tooltip>Stop</Tooltip>}>
                  <Button variant="danger" className="rounded-circle btn-rounded-circle" onClick={stop}><FaStop/></Button>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip>Repeat</Tooltip>}>
                  <Button variant={repeat?'warning':'outline-light'} className="rounded-circle btn-rounded-circle" onClick={()=>setRepeat(r=>!r)} aria-pressed={repeat}>
                    <FaRedo/>
                  </Button>
                </OverlayTrigger>
              </div>

              {/* Volume slider */}
              <Form.Group as={Row} className="align-items-center justify-content-center mb-4" style={{ maxWidth:200 }}>
                <Col xs="auto"><FaVolumeUp/></Col>
                <Col><Form.Range value={volume} min={0} max={1} step={0.01} onChange={changeVolume}/></Col>
              </Form.Group>

              {/* Enhanced Lyrics Area */}
              <Accordion defaultActiveKey="0" className="w-100 mb-4" style={{ maxWidth:500 }}>
                <Accordion.Item eventKey="0" className="bg-secondary bg-opacity-25 text-light">
                  <Accordion.Header><FaMusic className="me-2"/> Lyrics</Accordion.Header>
                  <Accordion.Body style={{ maxHeight:200, overflowY:'auto' }}>
                    <ListGroup variant="flush">
                      {lyricsArray.map((line, i) => (
                        <ListGroup.Item
                          key={i}
                          ref={el=>lyricRefs.current[i]=el}
                          active={i===currentLine}
                          className={i===currentLine? 'fw-bold':'text-light'}
                          style={{ transition:'background-color 0.3s', backgroundColor: i===currentLine ? 'rgba(0,123,255,0.2)' : 'transparent', border:'none', padding:'4px 0' }}
                        >
                          <small className="text-muted me-2">{formatTime(line.time)}</small>
                          {line.text}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              {/* Queue Toggle */}
              <OverlayTrigger overlay={<Tooltip>Show Play Queue</Tooltip>}>
                <Button variant="outline-info" className="position-relative mb-3 btn-rounded-circle" onClick={toggleQueue}>
                  <FaListUl className="me-1"/> Queue
                  {queue.length>0 && <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">{queue.length}</Badge>}
                </Button>
              </OverlayTrigger>
            </Card.Body>
          </Card>

          {/* Offcanvas Queue */}
          <Offcanvas show={showQueue} onHide={toggleQueue} placement="end" backdrop={false}>
            <Offcanvas.Header closeButton className="bg-dark text-light">
              <Offcanvas.Title>Play Queue</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="bg-dark text-light">
              <ListGroup variant="flush">
                {queue.map((song, idx) => (
                  <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center bg-transparent text-light" draggable onDragStart={()=>handleDragStart(idx)} onDragOver={handleDragOver} onDrop={()=>handleDrop(idx)} style={{cursor:'grab'}}>
                    <span style={{fontSize:18}}>⠿</span><span className="ms-2">{song.title}</span>
                    <Button variant="outline-danger" size="sm" onClick={()=>removeAt(idx)}><FaTrash/></Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              {queue.length===0 && <div className="text-center mt-4 text-muted">Queue is empty</div>}
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </div>
    </div>
  );
};

export default MusicPlayer;
