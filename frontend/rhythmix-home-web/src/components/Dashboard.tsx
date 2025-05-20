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
  Spinner,
} from 'react-bootstrap';
import { FaSearch, FaPlay, FaPlus } from 'react-icons/fa';
import type { SongMetadata } from '../model';
import { useMusicPlayerStore, type UseMusicPlayerStore } from 'container/musicPlayer';
import { getRecentlyPlayedSongs, getSongs, getSongsByPreference } from 'container/backendService';
import FooterMusicPlayer from './FooterMusicPlayer';
import { MdRefresh } from 'react-icons/md';

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
  const [recentLoading,setRecentLoading] = useState(false);
  const [recommendedLoading,setRecommendedLoading] = useState(false);

  const capitalizeFirst = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const fetchRecentlyPlayedSongs = async () => {
    setRecentLoading(true);
    try {
      const response = await getRecentlyPlayedSongs();
      if (response.status === 200) {
        const songs = response.data;
        const newSongs:SongMetadata[]  = [];
        songs.forEach((song: SongMetadata) => {
          newSongs.push(song);
        });
        const isChanged: boolean = JSON.stringify(songs.map((s: SongMetadata) => s.id)) !== JSON.stringify(recent.map((s: SongMetadata) => s.id));
        if (isChanged) {
          setRecent(songs);
        }
      }
    } catch (error) {
      console.error('Error fetching recently played songs:', error);
    }finally {
      setRecentLoading(false);
    }
  };

  useEffect(() => {
    if (document.visibilityState === 'visible') {
      fetchRecentlyPlayedSongs();
    }
  }, []);

  useEffect(() => {
    const types: string[] = ['ARTIST','LANGUAGE','GENRE'];
    setRecommendedLoading(true);
    let mounted = true;
    Promise.all(types.map(t => getSongsByPreference(t)))
      .then(responses => {
        const lists = responses.flatMap(r => {
          if (r.status !== 200 || typeof r.data !== 'object') return [];
          return Object.entries(r.data).map(([key, arr]) => {
            if (!Array.isArray(arr) || arr.length === 0) return null;
            const random = arr[Math.floor(Math.random()*arr.length)];
            return {
              title: `${capitalizeFirst(key)} Mix`,
              coverArt: random.coverArt,
              songs: arr as SongMetadata[],
            };
          }).filter(Boolean) as Playlist[];
        });
        setRecommended(lists);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        if (mounted) setRecommendedLoading(false);
      });
    return () => {mounted = false};
  }, []);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<SongMetadata[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // a little debounce timer
  useEffect(() => {
    if (!searchKeyword) {
      setSearchResults([]);
      return;
    }

    const handle = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const { status, data } = await getSongs(searchKeyword);
        if (status === 200 && Array.isArray(data.content)) {
          setSearchResults(data.content);
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(handle);
  }, [searchKeyword]);

  return (
    <>
      <Container fluid className="p-4 mb-5">
        {/* Greeting & Search */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Welcome back, {userData.userName}!</h3>
          <InputGroup style={{ maxWidth: 300 }}>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <FormControl
              placeholder="Search music, artist, album..."
              aria-label="Search music, artist, album..."
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
            />
          </InputGroup>
        </div>

        {searchKeyword && (
          <Section
            title={`Search: "${searchKeyword}"`}
            items={searchResults}
            grid
            loader={searchLoading}
          />
        )}
        {/* Sections */}
        <Section title="Recommended Playlists" playlist={recommended} grid loader={recommendedLoading} />
        <Section title="Recently Played" items={recent} grid loader={recentLoading} showRefresh refresh={fetchRecentlyPlayedSongs} />
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
  loader: boolean;
  showRefresh?: boolean;
  refresh?: () => void;
}

const Section: React.FC<SectionProps> = ({ title, items, playlist, grid, loader, showRefresh, refresh }) => {
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

  const playPlayList = async (songs: SongMetadata[]) => {
    for (const track of songs) {
      addSongToQueue(track);
    }
  }

  const spinner = (
    <Col xs={12} className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <Spinner animation="border" role="status" variant="primary" />
      <span className="visually-hidden">Loading...</span>
    </Col>
  );

  return (
    <section className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">{title}</h4>
        {showRefresh && <div className="d-flex ms-auto">
          <Button
            variant="primary"
            className="shadow-lg mb-4" onClick={refresh}> <MdRefresh></MdRefresh> </Button>
        </div>}
      </div>
      <Row
        className={
          grid
            ? 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4'
            : 'flex-nowrap overflow-auto'
        }
      >
          {loader && spinner}
          {!loader && items && items.length>0 && items.map((item) => (
          <Col key={item.id} className="d-flex">
            <Card className="music-card h-100 border-0 shadow-sm">
              <div className="position-relative image-container">
                <Card.Img
                  src={item.coverArt}
                  alt={item.title}
                  className="rounded-top fade-in"
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
                      onClick={() => addSongToQueue(item)}
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
        ))}
        {!loader && playlist && playlist.length > 0 && playlist.map((item,index) => (
          <Col key={index} className="d-flex">
            <Card className="music-card h-100 border-0 shadow-sm">
              <div className="position-relative image-container">
                <Card.Img
                  src={item.coverArt}
                  alt={item.title}
                  className="rounded-top fade-in"
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
