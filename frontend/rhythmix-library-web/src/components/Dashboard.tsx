import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, ButtonGroup, Spinner, ListGroup } from 'react-bootstrap';
import { FaSearch, FaPlay } from 'react-icons/fa';
import FooterMusicPlayer from './FooterMusicPlayer';
import { useMusicPlayerStore, type UseMusicPlayerStore } from 'container/musicPlayer';
import { MdLibraryMusic, MdRefresh } from 'react-icons/md';
import type { Playlist, SongMetadata } from '../model';
import { addSongToPlaylist, deletePlaylist, deleteSongFromPlaylist, getPlaylistSongs, getRecentlyPlayedSongs, getUserPlaylists, likeSong, unlikeSong, type AddToPlaylistDto, type ServerResponse } from 'container/backendService';
import SongActionMenu from './SongActionMenu';
import { FaDeleteLeft } from 'react-icons/fa6';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedPlaylist, setSelectedPlaylist] = useState('liked');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongIds, setLikedSongIds] = useState<Set<string>>(new Set());

  const [loadingPlaylists, setLoadingPlaylists] = useState(true);

  const fetchPlaylists = async () => {
      setLoadingPlaylists(true);
      const likedPlaylist: Playlist = {
        id: 'liked',
        name: 'Liked Songs',  
        tracks: [],
      }
      likedPlaylist.tracks = await getPlaylistSongs('liked').then((response: ServerResponse) => {
        if (response.status == 200){
          const songs = response.data;
          const songIds = new Set<string>();
          songs.forEach((song: SongMetadata) => {
            songIds.add(song.id);
          });
          setLikedSongIds(songIds);
          return songs;
        }
        return [];
      });
      setPlaylists([likedPlaylist]);
      try {
        getUserPlaylists().then(async (response: ServerResponse) => {
          if (response.status == 200) {
            const fetchedPlaylists: Playlist[] = await Promise.all(
              response.data.map(async (pl: string) => {
                const tracks: SongMetadata[] = await getPlaylistSongs(pl).then((response: ServerResponse) => {
                  if (response.status == 200) return response.data;
                  return [];
                });
                return {
                  id: pl,
                  name: pl,
                  tracks: tracks,
                };
              })
            );
            setPlaylists((prev) => [...prev, ...fetchedPlaylists]);
          }
        })
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }finally {  
        setLoadingPlaylists(false);
      }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);
  

  const playTrackSong = useMusicPlayerStore((state:UseMusicPlayerStore) => state.playTrackSong);

  const addSongToQueue = useMusicPlayerStore((state:UseMusicPlayerStore) => state.addSongToQueue);

  const clearQueue = useMusicPlayerStore((state:UseMusicPlayerStore) => state.clearQueue);

  const stop = useMusicPlayerStore((state:UseMusicPlayerStore) => state.stop);

  // Find currently selected playlist
  const currentPlaylist = playlists.find(pl => pl.id === selectedPlaylist) || playlists[0] || { id: '', name: '', tracks: [] };

  // Filter tracks by search within playlist
  const displayedTracks = currentPlaylist.tracks.filter(
    track =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [recent, setRecent] = useState([]);
  const [recentLoading,setRecentLoading] = useState(false);

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

  const isLiked = (songId?: string): boolean => !!songId && likedSongIds.has(songId);

  const toggleLike = async (songId?: string) => {
    if (!songId) return;
    console.log('Toggling like for song:', songId);
    const updated = new Set(likedSongIds);
    const alreadyLiked = updated.has(songId);

    alreadyLiked ? updated.delete(songId) : updated.add(songId);
    setLikedSongIds(new Set(updated));
    console.log('Updated liked song IDs:', likedSongIds);
    console.log('Already liked:', alreadyLiked);

    try {
      if (alreadyLiked) {
        await unlikeSong(songId);
        console.log('Song unliked:', songId);
      } else {
        await likeSong(songId);
        console.log('Song liked:', songId);
      }
    } catch (err) {
      console.error("Like toggle failed", err);
      alreadyLiked ? updated.add(songId) : updated.delete(songId);
      setLikedSongIds(new Set(updated));
    } finally {
      await fetchPlaylists();
    } 
  };

  const handleAddSongToPlaylist = async (dto:AddToPlaylistDto) => {
    addSongToPlaylist(dto).then((response:ServerResponse) => {  
      if (response.status === 200) {
        console.log('Song added to playlist:', response.data);
        fetchPlaylists();
      } else {
        console.error('Error adding song to playlist:', response.data);
      }
    }).catch((error) => {
      console.error('Error adding song to playlist:', error);
    }
    );
  }

  const spinner = (
    <Col xs={12} className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <Spinner animation="border" role="status" variant="primary" />
      <span className="visually-hidden">Loading...</span>
    </Col>
  );

  const [playingAll, setPlayingAll] = useState(false);

  const [deletePlaylistLoading, setDeletePlaylistLoading] = useState(false);

  const playCurrentPlayList = () => {
    if (currentPlaylist.tracks.length === 0) return
    setPlayingAll(true);
    clearQueue();
    stop();
    currentPlaylist.tracks.forEach(track => {
      addSongToQueue(track);
    });
    setPlayingAll(false);
  };

  const handleDeleteSongFromPlaylist = (song: SongMetadata) => {
    if (!selectedPlaylist || selectedPlaylist === 'liked') return;
    deleteSongFromPlaylist(selectedPlaylist, song.id).then((response:ServerResponse) => {
      if (response.status === 200) {
        console.log('Song deleted from playlist:', response.data);
        fetchPlaylists();
        if(currentPlaylist.tracks.length === 0) {
          setSelectedPlaylist('liked');
        }
      } else {
        console.error('Error deleting song from playlist:', response.data);
      }
    }).catch((error) => {
      console.error('Error deleting song from playlist:', error);
    });
  }
  const handleDeletePlaylist = (playlistName: string) => {
    setDeletePlaylistLoading(true);
    deletePlaylist(playlistName).then((response:ServerResponse) => {
      if (response.status === 200) {
        console.log('Playlist deleted:', response.data);
        fetchPlaylists();
        setSelectedPlaylist('liked');
        setDeletePlaylistLoading(false);
      } else {
        console.error('Error deleting playlist:', response.data);
      }
    } ).catch((error) => {  
      console.error('Error deleting playlist:', error);
    });
  }

  
  return (
    <Container fluid className="p-4 mb-5">
      <div className="d-flex flex-column min-vh-100">
        <h3 className='text-light pt-3'><MdLibraryMusic/> Library</h3>
        {/* Main Content */}
        <Container fluid className="flex-grow-1 py-4">
          {/* Playlists Selector */}
          <div className="d-flex mb-4">
            <ButtonGroup>
              {playlists.map((pl) => (
                <Button
                  key={pl.id}
                  variant={pl.id === selectedPlaylist ? 'primary' : 'outline-light'}
                  onClick={() => setSelectedPlaylist(pl.id)}
                >
                  {pl.name}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          {/* Search & View Controls */}
          <Row className="align-items-center mb-4">
            <Col xs={12} md={8} className="mb-3 mb-md-0">
              <InputGroup>
                <InputGroup.Text className="border-0">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search tracks, artists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0"
                />
              </InputGroup>
            </Col>
            <Col xs={12} md={4} className="text-md-end">
              <ButtonGroup>
                <Button value="grid" onClick={() => setViewMode('grid')} variant={viewMode == 'grid'?'primary':"outline-light"}>
                  Grid
                </Button>
                <Button value="list" onClick={() => setViewMode('list')} variant={viewMode == 'list'?'primary':"outline-light"}>
                  List
                </Button>
              </ButtonGroup>
            </Col>
          </Row>

          <Button
            disabled={playingAll}
            variant="primary"
            className="shadow-lg m-1 mb-4"
            onClick={() => {
              playCurrentPlayList();   
            }}
          >
            {playingAll ? <Spinner animation="border" size="sm" /> : <FaPlay />} Play All
          </Button>
          
          <Button
            hidden={selectedPlaylist === 'liked'}
            variant="primary"
            className="shadow-lg m-1 mb-4"
            onClick={() => {
              handleDeletePlaylist(selectedPlaylist);   
            }}
          >
            {deletePlaylistLoading ? <Spinner animation="border" size="sm" /> : <FaDeleteLeft />} Delete Playlist
          </Button>
          {/* Tracks Display */}
          { loadingPlaylists ? spinner : (viewMode === 'grid' ? (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              
              {displayedTracks.length ? (
                displayedTracks.map((item) => (
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
                              hidden={selectedPlaylist === 'liked'}
                              variant="light"
                              className="rounded-circle p-3 m-4 shadow-lg"
                              onClick={() => handleDeleteSongFromPlaylist(item)}
                            >
                              <FaDeleteLeft />
                            </Button>
                            <SongActionMenu
                                song={item}
                                addSongToQueue={addSongToQueue}
                                toggleLike={toggleLike}
                                isLiked={isLiked}
                                addSongToPlaylist={handleAddSongToPlaylist}
                                getUserPlaylists={getUserPlaylists}
                             />
                            
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
              ) : (
                <div className="w-100 text-center text-light py-5 fs-5">
                  No songs found in this playlist.
                </div>
              )}  
            </Row>
          ) : (
            <ListGroup variant="flush" >
              {displayedTracks.length ? (displayedTracks.map((track) => (
                <ListGroup.Item
                  key={track.id}
                  className="bg-dark text-light d-flex justify-content-between align-items-center py-1 border-secondary rounded-2 mb-1"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={track.coverArt}
                      alt={track.title}
                      className="rounded me-3 fade-in"
                      style={{ width: 60, height: 60, objectFit: 'cover' }}
                    />
                    <div>
                      <div className="fw-semibold text-truncate" style={{ maxWidth: 200 }}>
                        {track.title}
                      </div>
                      <div className="small text-truncate" style={{ maxWidth: 200 }}>
                        {track.artist}
                      </div>
                    </div>
                  </div>
                  <div className='ms-auto gap-2 d-flex'>
                    <Button variant="primary"
                      className="rounded-circle p-3 m-4 shadow-lg"
                      onClick={() => playTrackSong(track)}>
                      <FaPlay />
                    </Button>
                    <Button
                      hidden={selectedPlaylist === 'liked'}
                      variant="light"
                      className="rounded-circle p-3 m-4 shadow-lg"
                      onClick={() => handleDeleteSongFromPlaylist(track)}
                    >
                      <FaDeleteLeft />
                    </Button>
                    <SongActionMenu
                      song={track}
                      addSongToQueue={addSongToQueue}
                      toggleLike={toggleLike}
                      isLiked={isLiked}
                      addSongToPlaylist={handleAddSongToPlaylist}
                      getUserPlaylists={getUserPlaylists}
                    />
                  </div>
                </ListGroup.Item>
              ))) : (
                <div className="w-100 text-center text-light py-5 fs-5">
                  No songs found in this playlist.
                </div>
              )}  
            </ListGroup>
          ))}

          {/* Recently Played */}
          <div className="d-flex mt-5 mb-3 text-light border-secondary border-bottom pb-2">
            <h4 className="fw-bold mb-0">Recently Played</h4>
            <div className="d-flex ms-auto">
              <Button
                variant="primary"
                className="shadow-lg mb-4" onClick={fetchRecentlyPlayedSongs}> <MdRefresh /> </Button>
            </div>
          </div>
          <Row xs={2} sm={3} md={4} lg={5} className="g-3">
            {recentLoading ? spinner : recent.map((item:SongMetadata) => (
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
                        <SongActionMenu
                            song={item}
                            addSongToQueue={addSongToQueue}
                            toggleLike={toggleLike}
                            isLiked={isLiked}
                            addSongToPlaylist={handleAddSongToPlaylist}
                            getUserPlaylists={getUserPlaylists}
                        />
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
          </Row>
        </Container>

        <Container>
          <FooterMusicPlayer musicPlayerNavigationUrl="/player/music" />
        </Container>
      </div>
    </Container>
  );
};

export default Dashboard;