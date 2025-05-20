declare module 'container/AuthStore' {
  export const useAuthStore: any;
}

declare module 'container/backendService' {
  export interface ServerResponse {
    status: number;
    data: any;
  }

  export declare const getSongs: (keyword: string) => Promise<ServerResponse>;

  export declare const getRecentlyPlayedSongs: () => Promise<ServerResponse>;

  export declare const auditSong : (songId: string) => Promise<ServerResponse>;

  export declare const getSongsByPreference : (preferenceType:string) => Promise<ServerResponse>;

  export declare const getUser: () => any;

}

declare module 'container/musicPlayer' {
  import { Howl } from 'howler';
  import type { SongMetadata } from './music/model';
  import { UseBoundStore } from 'zustand';


  export interface MusicPlayerState {
    queue: SongMetadata[];
    currentTrackIndex: number;
    player: Howl | null;
    isPlaying: boolean;
    isShuffling: boolean;
    isRepeating: boolean;
    volume: number;
  }

  export interface MusicPlayerActions {
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
    stop: () => void;
  }

  export type UseMusicPlayerStore = UseBoundStore<MusicPlayerState & MusicPlayerActions>;

  export const useMusicPlayerStore: UseMusicPlayerStore;
}
