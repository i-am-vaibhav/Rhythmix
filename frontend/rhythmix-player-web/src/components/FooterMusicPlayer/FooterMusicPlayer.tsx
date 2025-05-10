import React, { use, useEffect, useRef, useState } from 'react';
import { Button, ProgressBar, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaPlay, FaPause, FaListUl } from 'react-icons/fa';
import { FaMaximize, FaRepeat, FaShuffle } from 'react-icons/fa6';
import { Howl } from 'howler';
import { mockSongMetadata, type SongMetadata } from '../../music/model';
import styles from './FooterMusicPlayer.module.css'; // Import the CSS Module
import PlayQueue from '../PlayQueue';
import { useNavigate } from 'react-router-dom';


interface FooterMusicPlayerProps {
  musicPlayerNavigationUrl: string;
}

const FooterMusicPlayer: React.FC<FooterMusicPlayerProps> = ({musicPlayerNavigationUrl}) => {
  const soundRef = useRef<Howl | null>(null);
  const [songMetadata, setSongMetadata] = useState<SongMetadata>(mockSongMetadata);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [queue, setQueue] = useState<SongMetadata[]>([mockSongMetadata]);
  const [repeat, setRepeat] = useState(false);

  const [showQueue, setShowQueue] = useState(false);
  const toggleQueue = () => setShowQueue(prev => !prev);
  const navigate = useNavigate();

  const removeAt = (i: number) => setQueue(q => [...q.slice(0, i), ...q.slice(i + 1)]);

  const dequeue = () => {
    let next;
    setQueue(q => {
      next = q[0];
      return q.slice(1);
    });
    return next;
  };


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

  const togglePlay = () => {
    const s = soundRef.current;
    if (!s) return;
    s.playing() ? s.pause() : s.play();
  };

  const playTrack = (song: SongMetadata) => {
      soundRef.current?.stop();
      const sound = createSound(song);
      soundRef.current = sound;
      sound.play();
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundRef.current?.volume(newVolume);
  };

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
    const sound = createSound(songMetadata);
    soundRef.current = sound;
    sound.play();
    return () => {
      sound.stop();
      sound.unload();
    }
  }, []);

  const updateProgress = () => {
    const interval = setInterval(() => {
      const s = soundRef.current;
      if (s?.playing()) setProgress(s.seek() as number);
    }, 500);
    soundRef.current?.on('stop', () => clearInterval(interval));
  };

  const formatTime = (t: number) => isNaN(t) ? '0:00' : `${Math.floor(t / 60)}:${('0' + Math.floor(t % 60)).slice(-2)}`;

  return (
    <footer className={styles['footer-player']}>
      <div className={styles['footer-inner-container']}>
        <Row className="align-items-center w-100">
          <Col md={3} className="d-flex align-items-center">
            <img
              src={songMetadata.coverArt}
              alt="Cover"
              className={styles['card-img'] + ' me-3'}
            />
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
          <Col md={2} className="d-flex align-items-center justify-content-center">
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
                <FaListUl/>
              </Button>
            </OverlayTrigger>
          </Col>
          <Col md={2} className="d-flex align-items-center justify-content-end">
            <Form.Range value={volume * 100} onChange={changeVolume} className={styles['form-range-dark']} />
          </Col>

          <Col md={1} className="d-flex align-items-center justify-content-end">
            <Button onClick={() => navigate(
          musicPlayerNavigationUrl)} className={styles['btn-rounded-circle']} >
              <FaMaximize/>
            </Button>
          </Col>
        </Row>
      </div>
      <PlayQueue 
        queue={queue}
        show={showQueue}
        onHide={toggleQueue}
        onClear={() => setQueue([])}
        playTrack={playTrack}
        loading={false}
        removeAt={removeAt} 
      />
    </footer>
  );
};

export default FooterMusicPlayer;
