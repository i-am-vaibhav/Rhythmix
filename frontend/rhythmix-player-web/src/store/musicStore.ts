// musicStore.ts
import { create } from 'zustand';
import { Howl } from 'howler';
import { mockLyrics, type SongMetadata } from '../music/model';

// Implement this in your api.ts
const fetchLyrics = async (url: string): Promise<string> => {
  const res = await fetch(url);
  if (!res.ok) return mockLyrics;
  return await res.text();
};

interface MusicState {
  soundRef: Howl | null;
  songMetadata: SongMetadata | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentLine: number;
  volume: number;
  shuffle: boolean;
  repeat: boolean;
  queue: SongMetadata[];
  showQueue: boolean;
  lyricRefs: Array<HTMLLIElement | null>;
  lyricsArray: string[];

  formatTime: (t: number) => string;
  togglePlay: () => void;
  changeVolume: (v: number) => void;
  toggleQueue: () => void;
  setShowQueue: (show: boolean) => void;
  playTrack: (song: SongMetadata) => Promise<void>;
  dequeue: () => SongMetadata | undefined;
  removeAt: (i: number) => void;
  handleSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  initializeQueue: (incomingQueue: SongMetadata[]) => Promise<void>;
}

export const useMusicStore = create<MusicState>((set, get) => {
  let soundRef: Howl | null = null;

  const updateProgress = () => {
    const sound = get().soundRef;
    if (sound?.playing()) {
      set({ progress: sound.seek() as number });
      requestAnimationFrame(updateProgress);
    }
  };

  const loadLyrics = async (lyricsUrl?: string): Promise<string[]> => {
    if (!lyricsUrl) return [];
    try {
      const lyrics = await fetchLyrics(lyricsUrl);
      return lyrics.split('\n'); // You can parse to timestamps if needed
    } catch (e) {
      console.error('Failed to fetch lyrics', e);
      return [];
    }
  };

  const createSound = (song: SongMetadata) => {
    const sound = new Howl({
      src: [song.url],
      html5: true,
      volume: get().volume,
      onplay: () => {
        set({ isPlaying: true, duration: sound.duration() });
        updateProgress();
      },
      onpause: () => set({ isPlaying: false }),
      onstop: () => set({ isPlaying: false }),
      onend: async () => {
        if (get().repeat) {
          sound.play();
        } else {
          const next = get().dequeue();
          if (next) {
            await get().playTrack(next);
          } else {
            set({ isPlaying: false });
          }
        }
      },
    });
    return sound;
  };

  const fetchCoverArt = async (coverArt: string): Promise<string> => {
    try {
      if (!coverArt.startsWith('http')) return coverArt;
      const res = await fetch(coverArt);
      const contentType = res.headers.get('content-type');

      // If it's an image, return the same URL or blob
      if (contentType && contentType.startsWith('image/')) {
        return coverArt;
      }

      // Otherwise assume JSON with a URL field
      const data = await res.json();
      return data.url || coverArt;
    } catch (e) {
      console.warn('Failed to fetch cover art:', e);
      return coverArt;
    }
  };

  return {
    soundRef: null,
    songMetadata: null,
    isPlaying: false,
    progress: 0,
    duration: 0,
    currentLine: 0,
    volume: 1,
    shuffle: false,
    repeat: false,
    queue: [],
    showQueue: false,
    lyricRefs: [],
    lyricsArray: [],

    formatTime: (t) => isNaN(t) ? '0:00' : `${Math.floor(t / 60)}:${('0' + Math.floor(t % 60)).slice(-2)}`,

    togglePlay: () => {
      const sound = get().soundRef;
      if (!sound) return;
      sound.playing() ? sound.pause() : sound.play();
    },

    changeVolume: (v) => {
      get().soundRef?.volume(v);
      set({ volume: v });
    },

    toggleQueue: () => set(state => ({ showQueue: !state.showQueue })),
    setShowQueue: (show) => set({ showQueue: show }),

    playTrack: async (song) => {
      get().soundRef?.stop();

      const [lyricsArray, coverArt] = await Promise.all([
        loadLyrics(song.lyricsUrl),
        fetchCoverArt(song.coverArt)
      ]);

      const updatedSong: SongMetadata = {
        ...song,
        coverArt
      };

      const sound = createSound(updatedSong);
      soundRef = sound;
      set({
        soundRef: sound,
        songMetadata: updatedSong,
        lyricsArray
      });
      sound.play();
    },

    dequeue: () => {
      let next: SongMetadata | undefined;
      set(state => {
        next = state.queue[0];
        return { queue: state.queue.slice(1) };
      });
      return next;
    },

    removeAt: (i) => {
      set(state => ({
        queue: [...state.queue.slice(0, i), ...state.queue.slice(i + 1)]
      }));
    },

    handleSeek: (e) => {
      const duration = get().duration;
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      get().soundRef?.seek(newTime);
      set({ progress: newTime });
    },

    initializeQueue: async (incomingQueue) => {
      if (!incomingQueue.length) return;
      const [first, ...rest] = incomingQueue;
      set({ queue: rest });
      await get().playTrack(first);
    }
  };
});