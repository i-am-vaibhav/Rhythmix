// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuthStore } from 'container/AuthStore';
import { Navigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap';
import { FaSearch, FaPlay, FaPlus } from 'react-icons/fa';
import type { SongMetadata } from '../model';
import { useMusicPlayerStore, type UseMusicPlayerStore } from 'container/musicPlayer';
import { auditSong, getRecentlyPlayedSongs, getSongsByPreference } from 'container/backendService';
import FooterMusicPlayer from './FooterMusicPlayer';

export interface Playlist {
  coverArt:string,
  songs:SongMetadata[],
  title:string
}
const Dashboard: React.FC = () => {
  const { userData } = useAuthStore();
  if (!userData) return <Navigate to="/" />;

  const [recent, setRecent] = useState<SongMetadata[]>([]);
  const [recommended, setRecommended] = useState<Playlist[]>([]);


  const capitalizeFirst = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  useEffect(() => {
    const fetchRecentlyPlayedSongs = async () => {
      const response = await getRecentlyPlayedSongs(0,10);
      if (response.status === 200) {
        const songs = response.data?.content;
        if (Array.isArray(songs) && songs.length > 0) {
          console.log(songs);
          songs.forEach((song: SongMetadata) => {
            setRecent((prev) => [...prev, song]);
          });
        }
      }
    };
    fetchRecentlyPlayedSongs();
  }, []);

  useEffect(() => {
    const fetchSongsByPreferenceArtist = async () => {
      const response = await getSongsByPreference('ARTIST');
      if (response.status === 200) {
        const songs = response.data;
        if (songs && typeof songs === 'object' && !Array.isArray(songs)) {
          Object.entries(songs).forEach(([artist, artistSongs]) => {
            if (Array.isArray(artistSongs) && artistSongs.length > 0) {
              const randomIndex = Math.floor(Math.random() * artistSongs.length);
              setRecommended(prev => [
                ...prev,
                {
                  coverArt: artistSongs[randomIndex].coverArt,
                  songs: artistSongs,
                  title: `${capitalizeFirst(artist)} Mix`,
                },
              ]);
            }
          });
        }
      }
    };
    fetchSongsByPreferenceArtist();
  }, []);

  useEffect(() => {
    const fetchSongsByPreferenceLanguage = async () => {
      const response = await getSongsByPreference('LANGUAGE');
      if (response.status === 200) {
        const songs = response.data;
        if (songs && typeof songs === 'object' && !Array.isArray(songs)) {
          Object.entries(songs).forEach(([artist, artistSongs]) => {
            if (Array.isArray(artistSongs) && artistSongs.length > 0) {
              const randomIndex = Math.floor(Math.random() * artistSongs.length);
              setRecommended(prev => [
                ...prev,
                {
                  coverArt: artistSongs[randomIndex].coverArt,
                  songs: artistSongs,
                  title: `${capitalizeFirst(artist)} Mix`,
                },
              ]);
            }
          });
        }
      }
    };
    fetchSongsByPreferenceLanguage();
  }, []);

  useEffect(() => {
    const fetchSongsByPreferenceGenre = async () => {
      const response = await getSongsByPreference('GENRE');
      if (response.status === 200) {
        const songs = response.data;
        if (songs && typeof songs === 'object' && !Array.isArray(songs)) {
          Object.entries(songs).forEach(([genre, genreSongs]) => {
            if (Array.isArray(genreSongs) && genreSongs.length > 0) {
                const randomIndex = Math.floor(Math.random() * genreSongs.length);
                setRecommended(prev => [
                ...prev,
                {
                  coverArt: genreSongs[randomIndex].coverArt,
                  songs: genreSongs,
                  title: `${capitalizeFirst(genre)} Mix`,
                },
                ]);
            }
          });
        }
      }
    };
    fetchSongsByPreferenceGenre();
  }, []);


  return (
    <>
      <Container fluid className="p-4 mb-5">
        {/* Greeting & Search */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Welcome back, {userData.userName}!</h3>
          <InputGroup style={{ maxWidth: 300 }}>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <FormControl placeholder="Search music" aria-label="Search music" />
          </InputGroup>
        </div>

        {/* Sections */}
        <Section title="Recently Played" items={recent} grid />
        <Section title="Recommended Playlists" playlist={recommended} grid />
      </Container>
      <Row>
        <FooterMusicPlayer musicPlayerNavigationUrl='/player/music' />
      </Row>
    </>
  );
};

interface SectionProps {
  title: string;
  items?: SongMetadata[];
  playlist?: Playlist[];
  grid?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, items, playlist, grid }) => {
  const addSongToQueue = useMusicPlayerStore(
    (state: UseMusicPlayerStore) => state.addSongToQueue
  );
  const playTrackSong = useMusicPlayerStore(
    (state: UseMusicPlayerStore) => state.playTrackSong
  );
  const clearQueue = useMusicPlayerStore(
    (state: UseMusicPlayerStore) => state.clearQueue
  );
  const stop = useMusicPlayerStore(
    (state: UseMusicPlayerStore) => state.stop
  );

  async function handleAddToQueue(item: SongMetadata): Promise<void> {
    if (item.id) {
      await auditSong(item.id);
    }
    addSongToQueue(item);
  }

  const playPlayList = async (songs: SongMetadata[]) => {
    for (const track of songs) {
      await handleAddToQueue(track);
    }
  }
  return (
    <section className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">{title}</h5>
      </div>
      <Row
        className={
          grid
            ? 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4'
            : 'flex-nowrap overflow-auto'
        }
      >
        {items ? items?.map((item) => (
          <Col key={item.id} className="d-flex">
            <Card className="music-card h-100 border-0 shadow-sm">
              <div className="position-relative image-container">
                <Card.Img
                  src={item.coverArt}
                  alt={item.title}
                  className="rounded-top"
                  style={{objectFit:'cover'}}
                />
                <Card.ImgOverlay className="overlay d-flex flex-column justify-content-center align-items-center">
                  <div className="m-2 d-flex opacity-75">
                    <Button
                      variant="light"
                      className="rounded-circle p-3 m-4 shadow-lg"
                      onClick={() => {
                        playTrackSong(item);
                      }}
                    >
                      <FaPlay />
                    </Button>
                    <Button
                      variant="light"
                      className="rounded-circle p-3 m-4 shadow-lg"
                      onClick={() => handleAddToQueue(item)}
                    >
                      <FaPlus />
                    </Button>
                  </div>
                  <div className="text-center d-flex flex-column justify-content-between">
                    <div className="text-light mb-1 fs-6 text-truncate">
                      {item.title}
                    </div>
                    <div className="text-light small text-truncate">
                      {item.artist}
                    </div>
                </div>
                </Card.ImgOverlay>
              </div>
            </Card>
          </Col>
        ))
        : playlist?.map((item,index) => (
          <Col key={index} className="d-flex">
            <Card className="music-card h-100 border-0 shadow-sm">
              <div className="position-relative image-container">
                <Card.Img
                  src={item.coverArt}
                  alt={item.title}
                  className="rounded-top"
                  style={{objectFit:'cover'}}
                />
                <Card.ImgOverlay className="overlay d-flex flex-column justify-content-center align-items-center">
                  <div className="m-2 d-flex opacity-75">
                    <Button
                      variant="light"
                      className="rounded-circle p-3 m-4 shadow-lg"
                      onClick={async () => {
                        stop();
                        clearQueue();
                        await playPlayList(item.songs);
                      }}
                    >
                      <FaPlay />
                    </Button>
                  </div>
                  <div className="text-center d-flex flex-column justify-content-between">
                    <div className="text-light mb-1 fs-6 text-truncate">
                      {item.title}
                    </div>
                  </div>
                </Card.ImgOverlay>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default Dashboard;
