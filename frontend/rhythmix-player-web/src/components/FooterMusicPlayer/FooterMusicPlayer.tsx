import React, { useEffect, useRef, useState } from 'react';
import { Button, ProgressBar, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaPlay, FaPause, FaListUl } from 'react-icons/fa';
import { FaMaximize, FaRepeat, FaShuffle } from 'react-icons/fa6';
import { Howl } from 'howler';
import type { SongMetadata } from '../../music/model';
import styles from './FooterMusicPlayer.module.css';
import PlayQueue from '../PlayQueue';
import { useNavigate } from 'react-router-dom';

interface FooterMusicPlayerProps {
  queue: SongMetadata[];
  setQueue: (queue: SongMetadata[]) => void;
  musicPlayerNavigationUrl: string;
}

const FooterMusicPlayer: React.FC<FooterMusicPlayerProps> = ({
  queue,
  setQueue,
  musicPlayerNavigationUrl,
}) => {
  const soundRef = useRef<Howl | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const navigate = useNavigate();

  const songMetadata = queue[0];
  if (!songMetadata) return null;

  // Toggle queue drawer
  const toggleQueue = () => setShowQueue(prev => !prev);

  // Dequeue next
  const dequeue = (): SongMetadata | undefined => {
    const next = queue[1];
    setQueue(queue.slice(1));
    return next;
  };

  // Create and return a new Howl instance, unloading any existing one
  const createSound = (song: SongMetadata) => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }
    const sound = new Howl({
      src: [song.url],
      volume,
      preload: true,
      onplay: () => {
        currentUrlRef.current = song.url;
        setIsPlaying(true);
        setDuration(sound.duration());
        startProgressUpdater();
      },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        if (repeat) {
          sound.play();
        } else if (dequeue()) {
          playTrack(dequeue()!);
        } else {
          setIsPlaying(false);
        }
      },
    });
    soundRef.current = sound;
    return sound;
  };

  // Play a track if not already playing
  const playTrack = (song: SongMetadata) => {
    if (song.url === currentUrlRef.current) return;
    const sound = createSound(song);
    sound.play();
    setQueue([song, ...queue.filter(s => s.url !== song.url)]);
  };

  // Toggle play/pause
  const togglePlay = () => {
    const s = soundRef.current;
    if (!s) return;
    s.playing() ? s.pause() : s.play();
  };

  // Change volume
  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value) / 100;
    setVolume(newVol);
    soundRef.current?.volume(newVol);
  };

  // Seek by click
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const time = ((e.clientX - rect.left) / rect.width) * duration;
    soundRef.current?.seek(time);
    setProgress(time);
  };

  // Update progress periodically
  const startProgressUpdater = () => {
    const iv = setInterval(() => {
      const s = soundRef.current;
      if (s?.playing()) setProgress(s.seek() as number);
    }, 500);
    soundRef.current?.on('stop', () => clearInterval(iv));
  };

  // Format m:ss
  const formatTime = (t: number) =>
    isNaN(t) ? '0:00' : `${Math.floor(t / 60)}:${('0' + Math.floor(t % 60)).slice(-2)}`;

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      switch (e.code) {
        case 'Space': e.preventDefault(); togglePlay(); break;
        case 'ArrowRight': soundRef.current?.seek((soundRef.current.seek() as number) + 10); break;
        case 'ArrowLeft': soundRef.current?.seek((soundRef.current.seek() as number) - 10); break;
        case 'ArrowUp': setVolume(v => Math.min(1, v + 0.1)); break;
        case 'ArrowDown': setVolume(v => Math.max(0, v - 0.1)); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // React to song changes
  useEffect(() => {
    const sound = createSound(songMetadata);
    sound.play();
    return () => {
      sound.stop();
      sound.unload();
    };
  }, [songMetadata]);

  return (
    <footer className={styles['footer-player']}>
      <div className={styles['footer-inner-container']}>
        <Row className="align-items-center w-100">
          <Col md={3} className="d-flex align-items-center">
            <img src={songMetadata.coverArt} alt="Cover" className={`${styles['card-img']} me-3`} />
            <div>
              <div className={styles['card-title']}>{songMetadata.title}</div>
              <div className={styles['card-text']}>{songMetadata.artist}</div>
            </div>
          </Col>
          <Col md={4}>
            <div onClick={handleSeek} style={{ cursor: 'pointer' }}>
              <ProgressBar now={(progress / duration) * 100} className={styles['progress-bar-dark']} />
              <div className={styles['time-display']}>
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </Col>
          <Col md={2} className="d-flex align-items-center justify-content-center gap-2">
            <Button variant={shuffle ? 'primary' : 'outline-light'} onClick={() => setShuffle(!shuffle)} className={styles['btn-rounded-circle']}>
              <FaShuffle />
            </Button>
            <Button variant={repeat ? 'primary' : 'outline-light'} onClick={() => setRepeat(!repeat)} className={styles['btn-rounded-circle']}>
              <FaRepeat />
            </Button>
            <Button onClick={togglePlay} className={styles['btn-rounded-circle']}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </Button>
            <OverlayTrigger overlay={<Tooltip>Show Play Queue</Tooltip>}>
              <Button variant="outline-info" className={styles['btn-rounded-circle']} onClick={toggleQueue}>
                <FaListUl />
              </Button>
            </OverlayTrigger>
          </Col>
          <Col md={2} className="d-flex align-items-center justify-content-end">
            <Form.Range
              min={0}
              max={100}
              value={volume * 100}
              onChange={changeVolume}
              className={styles['form-range-dark']}
            />
          </Col>
          <Col md={1} className="d-flex align-items-center justify-content-end">
            <Button onClick={() => {
                navigate(musicPlayerNavigationUrl);
                if (soundRef.current) {
                  soundRef.current.stop();
                  soundRef.current.unload();
                }
                soundRef.current = null;
                setIsPlaying(false);
              }
            } className={styles['btn-rounded-circle']}>
              <FaMaximize />
            </Button>
          </Col>
        </Row>
      </div>

      <PlayQueue
        show={showQueue}
        onHide={toggleQueue}
      />
    </footer>
  );
};

export default FooterMusicPlayer;