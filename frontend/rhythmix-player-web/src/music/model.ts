import mockSong from "../assets/mock-song/Suniyan Suniyan - Juss 128 Kbps.mp3";

export interface SongMetadata {
  id?: string;
  title: string;
  artist: string;
  album: string;
  coverArt: string;
  url: string;
  lyricsUrl?: string;
}

export interface Lyrics {
  [time: string]: string;
}

export const mockAudioUrl = {mockSong}; // Placeholder audio URL

export const mockSongMetadata: SongMetadata = {
  url: mockAudioUrl.mockSong,
  title: "Suniya Suniya",
  artist: "Ninja",
  album: "Suniya Suniya",
  coverArt: "https://i1.sndcdn.com/artworks-9L7V4njW3zkBVG1l-misuQQ-t500x500.jpg",
};

export const mockLyrics: Lyrics = {
  "7": "MixSingh in the house",
  "14": "O, sunnian-sunnian raataan te raataan de vich tu",
  "18": "Jad vi tainu labhan te mil jaave mainu tu",
  "22": "Saare din diyan gallan beh ke dassan main tainu",
  "25": "Tu mainu bhule na kade, main na bhulan tainu",
  "36": "O, sunnian-sunnian raataan te raataan de vich tu",
  "40": "Jad vi tainu labhan te mil jaave mainu tu",
  "44": "Saare din diyan gallan beh ke dassan main tainu",
  "47": "Tu mainu bhule na kade, main na bhulan tainu",
  "62": "Tainu main manawan, tere te mari jaawan",
  "66": "Mere te tu mare hi na",
  "70": "Aidan nahio hunda, main hi kari jaawan",
  "73": "Te tu mera kare hi na",
  "77": "Tainu main manawan, tere te mari jaawan",
  "81": "Mere te tu mare hi na",
  "84": "Aidan nahio hunda, main hi kari jaawan",
  "88": "Te tu mera kare hi na",
  "91": "O, challiyan-challiyan baataan te baataan de vich tu",
  "95": "Jad vi tang koi karda, bas karda tu mainu",
  "99": "Main hi kardi gallan, kyu nahi karda tu?",
  "103": "Tu mainu bhule na kade, main na bhulan tainu",
  "121": "O, khedan na kade vi tere dil naal main",
  "125": "Har vele rakhan tainu mere naal main",
  "129": "Mar jaawan othe jithe tu na mile",
  "132": "Jhooth na main bolan kade tere naal main",
  "136": "Meriyan jo gallan tainu buri lagan",
  "140": "Oh gallan karaan hi na",
  "143": "Tere wal vekhan, tainu hi main vekhan",
  "147": "Hor wal moonh karaan hi na",
  "150": "O, lammiyan-lammiyan waataan te waataan de vich tu",
  "154": "Main taan chahwan mera parchhaawan ban jaave tu",
  "158": "Nede-nede rakh le haath phad ke mainu",
  "162": "Tu mainu bhule na kade, main na bhulan tainu",
  "169": "O, sunnian-sunnian raataan te raataan de vich tu",
  "173": "Jad vi tainu labhan te mil jaave mainu tu",
  "177": "Saare din diyan gallan beh ke dassan main tainu",
  "180": "Tu mainu bhule na kade, main na bhulan tainu"
};