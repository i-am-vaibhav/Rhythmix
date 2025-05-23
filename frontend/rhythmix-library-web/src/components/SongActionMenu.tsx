import { getUser, type AddToPlaylistDto, type ServerResponse } from "container/backendService";
import React, { useState } from "react";
import {
  Dropdown,
  ButtonGroup,
  FormControl,
  Spinner,
  Button,
} from "react-bootstrap";
import { FaPlus, FaHeart, FaPlusCircle, FaEllipsisV, FaArrowLeft } from "react-icons/fa";
import type { SongMetadata } from "../model";

type Playlist = { id: string; name: string };

interface SongActionMenuProps {
  song: SongMetadata;
  addSongToQueue: (song: SongMetadata) => void;
  toggleLike: (songId: string) => Promise<void>;
  isLiked: (songId: string) => boolean;
  addSongToPlaylist: (dto: AddToPlaylistDto) => void;
  getUserPlaylists: () => Promise<ServerResponse>;
}

const SongActionMenu: React.FC<SongActionMenuProps> = ({
  song,
  addSongToQueue,
  toggleLike,
  isLiked,
  addSongToPlaylist,
  getUserPlaylists,
}) => {
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch playlists when submenu opens
  const loadPlaylists = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserPlaylists();
      if (response.status === 200 && Array.isArray(response.data)) {
        setPlaylists(response.data.map((pl: string) => ({ id: pl, name: pl })));
      } else {
        setError("Failed to load playlists");
        setPlaylists([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load playlists");
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPlaylistMenu = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPlaylistMenu(true);
    await loadPlaylists();
  };

  const handleSelectPlaylist = (e: React.MouseEvent, playlistId: string) => {
    e.preventDefault();
    e.stopPropagation();
    addSongToPlaylist({
      songId: song.id,
      userName: getUser().userName,
      playlistName: playlistId,
    });
    setShowPlaylistMenu(false);
    setNewPlaylistName("");
  };

  const handleCreatePlaylist = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newPlaylistName.trim()) {
      e.preventDefault();
      addSongToPlaylist({
        songId: song.id,
        userName: getUser().userName,
        playlistName: newPlaylistName.trim(),
      });
      setNewPlaylistName("");
      setShowPlaylistMenu(false);
    }
  };

  return (
    <Dropdown
      as={ButtonGroup}
      autoClose="outside"
      onToggle={(isOpen) => {
        if (!isOpen) {
          setShowPlaylistMenu(false);
          setNewPlaylistName("");
        }
      }}
    >
      <Dropdown.Toggle
        variant="light"
        className="rounded-circle p-3 m-4 shadow-lg"
        id={`dropdown-song-actions-${song.id}`}
      >
        <FaEllipsisV />
      </Dropdown.Toggle>

      <Dropdown.Menu className="shadow">
        {/* Add to Queue */}
        <Dropdown.Item
          as="button"
          className="d-flex align-items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            addSongToQueue(song);
          }}
        >
          <FaPlus /> Add to Queue
        </Dropdown.Item>

        {/* Like / Unlike */}
        <Dropdown.Item
          as="button"
          className="d-flex align-items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            toggleLike(song.id);
          }}
        >
          <FaHeart color={isLiked(song.id) ? "red" : "gray"} />{" "}
          {isLiked(song.id) ? "Unlike" : "Like"}
        </Dropdown.Item>

        {/* Either show main “Add to Playlist” or the submenu */}
        {!showPlaylistMenu ? (
          <Dropdown.Item
            as="button"
            className="d-flex align-items-center gap-2"
            onClick={handleOpenPlaylistMenu}
          >
            <FaPlusCircle /> Add to Playlist
          </Dropdown.Item>
        ) : (
          <Dropdown.ItemText className="px-3 py-2" style={{ minWidth: "220px" }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Button
                variant="link"
                size="sm"
                className="p-0"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPlaylistMenu(false);
                }}
              >
                <FaArrowLeft /> Back
              </Button>
              <strong>Select Playlist</strong>
              <span style={{ width: 24 }}/> {/* spacer */}
            </div>

            {loading ? (
              <div className="text-center py-2">
                <Spinner animation="border" size="sm" />
              </div>
            ) : error ? (
              <div className="text-danger small">{error}</div>
            ) : playlists.length === 0 ? (
              <div className="text-muted small">No playlists found</div>
            ) : (
              playlists.map((pl) => (
                <div
                  key={pl.id}
                  className="dropdown-item"
                  role="button"
                  onClick={(e) => handleSelectPlaylist(e, pl.id)}
                >
                  {pl.name}
                </div>
              ))
            )}

            <FormControl
              className="mt-2"
              placeholder="Create new playlist"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={handleCreatePlaylist}
            />
          </Dropdown.ItemText>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SongActionMenu;