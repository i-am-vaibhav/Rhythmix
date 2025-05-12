import {create} from 'zustand';
import { Howl, Howler } from 'howler';

export interface LyricsLine {
  time: number;
  text: string;
}

export interface SongMetadata {
  id?: string;
  title: string;
  artist: string;
  album: string;
  coverArt: string;
  url: string;
  lyrics: LyricsLine[];
}

interface MusicPlayerState {
  queue: SongMetadata[];
  currentTrackIndex: number;
  player: Howl | null;
  isPlaying: boolean;
  isShuffling: boolean;
  isRepeating: boolean;
  volume: number;
}

interface MusicPlayerActions {
  playTrack: (index: number) => void;
  onTrackEnd: () => void;
  playRandomTrack: () => void;
  playPreviousTrack: () => void;
  playNextTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addSongToQueue: (song: SongMetadata) => void;
  removeSongFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  seekTo: (time: number) => void;
  getSeek: () => number;
  getCurrentSongDuration: () => number | null;
  getCurrentSong: () => SongMetadata | null;
  playTrackAt: (index: number) => void;
  playTrackSong: (song:SongMetadata) => void;
}

export const useMusicPlayerStore = create<MusicPlayerState & MusicPlayerActions>((set, get) => {
  // initialize global volume
  Howler.volume(1);

  const playTrackInternal = (index: number) => {
    const { queue } = get();
    if (queue[index]) {
      const song = queue[index];
      // stop existing
      get().player?.stop();
      const howl = new Howl({
        src: [song.url],
        html5: true,
        onend: () => get().onTrackEnd(),
      });
      howl.play();
      set({ player: howl, isPlaying: true, currentTrackIndex: index });
      console.log(`Playing: ${song.title} by ${song.artist}`);
    }
  };

  return {
    queue: [],
    currentTrackIndex: -1,
    player: null,
    isPlaying: false,
    isShuffling: false,
    isRepeating: false,
    volume: Howler.volume(),

    playTrack: playTrackInternal,

    onTrackEnd: () => {
      const { isRepeating, isShuffling, playRandomTrack, playNextTrack, currentTrackIndex } = get();
      if (isRepeating) {
        playTrackInternal(currentTrackIndex);
      } else if (isShuffling) {
        playRandomTrack();
      } else {
        playNextTrack();
      }
    },

    playRandomTrack: () => {
      const { queue } = get();
      const randomIndex = Math.floor(Math.random() * queue.length);
      playTrackInternal(randomIndex);
    },

    playPreviousTrack: () => {
      const { currentTrackIndex } = get();
      if (currentTrackIndex > 0) {
        playTrackInternal(currentTrackIndex - 1);
      }
    },

    playNextTrack: () => {
      const { currentTrackIndex, queue } = get();
      if (currentTrackIndex < queue.length - 1) {
        playTrackInternal(currentTrackIndex + 1);
      } else {
        console.log('Reached end of queue.');
        set({ isPlaying: false });
      }
    },

    toggleShuffle: () => set(state => ({ isShuffling: !state.isShuffling })),

    toggleRepeat: () => set(state => ({ isRepeating: !state.isRepeating })),

    addSongToQueue: (song) => {
      set(state => ({ queue: [...state.queue, song] }));
      console.log(`Added to queue: ${song.title} by ${song.artist}`);
      const { queue, isPlaying } = get();
      if (queue.length === 1 && !isPlaying) {
        playTrackInternal(0);
      }
    },

    removeSongFromQueue: (index) => {
      const { queue, currentTrackIndex } = get();
      if (index !== -1) {
        const removed = queue[index];
        const newQueue = [...queue.slice(0, index), ...queue.slice(index + 1)];
        set({ queue: newQueue });
        console.log(`Removed from queue: ${removed.title} by ${removed.artist}`);
        if (index === currentTrackIndex) {
          get().playNextTrack();
        }
      }
    },

    reorderQueue: (fromIndex, toIndex) => {
      const { queue } = get();
      if (fromIndex < 0 || fromIndex >= queue.length || toIndex < 0 || toIndex >= queue.length) return;
      const newQueue = [...queue];
      const [moved] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, moved);
      set({ queue: newQueue });
      console.log(`Moved song to position ${toIndex}: ${moved.title}`);
    },

    clearQueue: () => {
      set({ queue: [], currentTrackIndex: -1 });
      console.log('Queue cleared.');
    },

    togglePlayPause: () => {
      const { isPlaying, player, queue, currentTrackIndex } = get();
      if (isPlaying) {
        player?.pause();
        set({ isPlaying: false });
        console.log('Paused.');
      } else {
        if (currentTrackIndex === -1 && queue.length > 0) {
          playTrackInternal(0);
        } else {
          player?.play();
          set({ isPlaying: true });
          console.log('Resumed playing.');
        }
      }
    },

    setVolume: (volume) => {
      if (volume >= 0 && volume <= 1) {
        Howler.volume(volume);
        set({ volume });
        console.log(`Volume set to ${volume * 100}%`);
      }
    },

    getVolume: () => Howler.volume(),

    seekTo: (time) => {
      get().player?.seek(time);
      console.log(`Seeking to ${time} seconds.`);
    },

    getSeek: () => {
      return get().player?.seek() as number;
    },

    getCurrentSongDuration: () => {
      const { player } = get();
      return player ? player.duration() : null;
    },

    getCurrentSong: () => {
      const { queue, currentTrackIndex } = get();
      return queue[currentTrackIndex] || null;
    },

    playTrackAt: (index) => playTrackInternal(index),

    playTrackSong: (song) => {
      const { queue, addSongToQueue } = get();
      const songIndex = queue.findIndex((track) => track.id === song.id);
      if (songIndex !== -1) {
        addSongToQueue(song);
        playTrackInternal(songIndex);
      } else {
        set(state => ({ queue: [...state.queue, song] }));
        playTrackInternal(queue.length);
      }
    }
  };
});
