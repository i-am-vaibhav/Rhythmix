import React, { useEffect, useState } from 'react';
import { Button, ProgressBar, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaPlay, FaPause, FaListUl } from 'react-icons/fa';
import { FaBackward, FaForward, FaMaximize, FaRepeat, FaShuffle } from 'react-icons/fa6';
import type { SongMetadata } from '../model.ts'
import styles from './FooterMusicPlayer.module.css';
import PlayQueue from './PlayQueue';
import { useNavigate } from 'react-router-dom';
import { useMusicPlayerStore, type UseMusicPlayerStore } from 'container/musicPlayer';

interface FooterMusicPlayerProps {
  musicPlayerNavigationUrl: string;
}

const FooterMusicPlayer: React.FC<FooterMusicPlayerProps> = ({
  musicPlayerNavigationUrl,
}) => {

  const queue = useMusicPlayerStore((state: UseMusicPlayerStore) => state.queue);
  const setVolume = useMusicPlayerStore((state: UseMusicPlayerStore) => state.setVolume);
  const isShuffling = useMusicPlayerStore((state: UseMusicPlayerStore) => state.isShuffling);
  const isRepeating = useMusicPlayerStore((state: UseMusicPlayerStore) => state.isRepeating);
  const isPlaying = useMusicPlayerStore((state: UseMusicPlayerStore) => state.isPlaying);
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

  const songMetadata: SongMetadata = getCurrentSong() || { 
    coverArt: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1BhBgvAdx2cQwiyvb-89VbGVzgQbB983tfw&s', 
    title: '', 
    artist: '', 
    album: '', 
    url: '',
    lyrics: null,
    id: ''
  };
  const [progress, setProgress] = useState(0);
  const duration = getCurrentSongDuration();
  const [showQueue, setShowQueue] = useState(false);
  const [shuffle, setShuffle] = useState(isShuffling);
  const [repeat, setRepeat] = useState(isRepeating);
  const navigate = useNavigate();

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

  // Format seconds to m:ss
  const formatTime = (t: number) =>
    isNaN(t) ? '0:00' : `${Math.floor(t / 60)}:${('0' + Math.floor(t % 60)).slice(-2)}`;

  function toggleQueue(): void {
    setShowQueue((prev) => !prev);
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      switch (e.code) {
        case 'Space': e.preventDefault(); togglePlayPause(); break;
        case 'ArrowRight': seekTo(getSeek() + 10); break;
        case 'ArrowLeft': seekTo(getSeek() - 10); break;
        case 'ArrowUp': setVolume(Math.min(1, getVolume() + 0.1)); break;
        case 'ArrowDown': setVolume(Math.min(1, getVolume() - 0.1)); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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
              <ProgressBar now={(progress / (duration || 1)) * 100} className={styles['progress-bar-dark']} />
              <div className={styles['time-display']}>
                <span>{formatTime(progress||0)}</span>
                <span>{formatTime(duration||0)}</span>
              </div>
            </div>
          </Col>
          <Col md={2} className="d-flex align-items-center justify-content-center gap-2">
            <Button disabled={queue.length==0} variant={shuffle ? 'primary' : 'outline-light'} onClick={() => {
              setShuffle(!shuffle);
              toggleShuffle();
            }} className={styles['btn-rounded-circle']}>
              <FaShuffle />
            </Button>
            <Button disabled={queue.length==0 || currentTrackIndex == 0}  onClick={() => playPreviousTrack()} className={styles['btn-rounded-circle']}>
              <FaBackward/>
            </Button>
            <Button disabled={queue.length==0} onClick={togglePlayPause} className={styles['btn-rounded-circle']}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </Button>
            <Button disabled={queue.length == currentTrackIndex+1}  onClick={() => playNextTrack()} className={styles['btn-rounded-circle']}>
              <FaForward/>
            </Button>
            <Button disabled={queue.length==0} variant={repeat ? 'primary' : 'outline-light'} onClick={() => {
              toggleRepeat();
              setRepeat(!repeat);
            }} className={styles['btn-rounded-circle']}>
              <FaRepeat />
            </Button>
          </Col>
          <Col md={2} className="d-flex align-items-center justify-content-end">
            <Form.Range
              min={0}
              max={100}
              value={getVolume() * 100}
              onChange={changeVolume}
              className={styles['form-range-dark']}
            />
          </Col>
          <Col md={1} className="d-flex align-items-center justify-content-end">
            <OverlayTrigger overlay={<Tooltip>Show Play Queue</Tooltip>}>
                <Button variant="outline-info" className={styles['btn-rounded-circle']} onClick={toggleQueue}>
                <FaListUl />
              </Button>
            </OverlayTrigger>
            <Button disabled={queue.length==0} onClick={() => {
                navigate(musicPlayerNavigationUrl);
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
