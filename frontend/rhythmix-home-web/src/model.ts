export interface LyricsLine {
  time: number;
  text: string;
}

export interface SongMetadata {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverArt: string;
  url: string;
  lyrics: LyricsLine[];
}