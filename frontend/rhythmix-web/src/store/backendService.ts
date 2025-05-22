import axios from 'axios';
import type { LoginRequest } from './authStore';
import type { SignupFormData } from './signupStore';

const API_BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

// Server Response
export interface ServerResponse {
  status: number,
  data: any
}

const getToken = () => {
  const token = localStorage.getItem('userToken');
  if (token) {
    const parsedToken = JSON.parse(token);
    return parsedToken.token;
  }
  return null;
};

export const getUser = () => {
  const token = localStorage.getItem('userToken');
  if (token) {
    const parsedToken = JSON.parse(token);
    return parsedToken.userData;
  }
  return null;
};

// Login API call
export const login = async ({ userName, password }: LoginRequest) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      userName,
      password,
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { status: error.response.status, data: error.response.data };
    }
    return { status: 500, data: { message: 'An unknown error occurred' } };
  }
};

// Register API call
export const register = async ({userName, email, password, mobile, genres, languages, artists}: SignupFormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      userName,
      email,
      password,
      phone: mobile,
      metadata:{
        preferredGenre: genres.join(","),
        preferredLanguage: languages.join(","),
        preferredArtist: artists.join(",")
      }
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { status: error.response.status, data: error.response.data };
    }
    return { status: 500, data: { message: 'An unknown error occurred' } };
  }
};

// Get Songs API call
export const getSongs = async (keyword:string) => {  
  try {
    const response : ServerResponse = await axios.get(`${API_BASE_URL}/songs/search/${encodeURIComponent(keyword)}`, {
      params: { page:0, pageSize:10 },
      headers: {
        Authorization: `Bearer ${getToken()}`,
        AuthUsername: getUser().userName,
      }
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { status: error.response.status, data: error.response.data };
    }
    return { status: 500, data: { message: 'An unknown error occurred' } };
  }
};

// Get Recently Played Songs API call
export const getRecentlyPlayedSongs = async (): Promise<ServerResponse> => {
  try {
    const userName = getUser().userName;
    const response : ServerResponse = await axios.get(`${API_BASE_URL}/songs/recently-played/${userName}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        AuthUsername: getUser().userName,
      }
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { status: error.response.status, data: error.response.data };
    }
    return { status: 500, data: { message: 'An unknown error occurred' } };
  }
}

// Send Audit Log for a Song Play
export const auditSong = async (songId: string): Promise<ServerResponse> => {
  try {
    const userName = getUser().userName;
    await axios.post(`${API_BASE_URL}/songs/audit`, {
      userName: userName,
      songId: songId
    }, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        AuthUsername: getUser().userName,
      }
    });
    return { status: 200, data: { message: 'Audit log sent successfully' } };
  } catch (error) {
    console.error('Error auditing song:', error);
    return { status: 500, data: { message: 'An unknown error occurred' } };
  }
};

// Get Song By Preferences
const capitalizeFirst = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const getSongsByPreference = async (
  preferenceType: 'GENRE' | 'LANGUAGE' | 'ARTIST'
): Promise<ServerResponse> => {
  const preferenceTypeCapitalized = capitalizeFirst(preferenceType);
  const preference = getUser().metadata[`preferred${preferenceTypeCapitalized}`];
  try {
    const url = `${API_BASE_URL}/songs/${preferenceType}/${encodeURIComponent(preference)}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        AuthUsername: getUser().userName, }
    });
  return { status: 200, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { status: error.response.status, data: error.response.data };
    }
  }
  return { status: 500, data: { message: 'An unknown error occurred' } };
};


export async function fetchLikedSongs(): Promise<string[]> {
  // GET /api/user/liked-songs
  //const res = await axios.get('/api/user/liked-songs');
  return []; // e.g. ['songId1', 'songId2']
}

export async function likeSong(songId: string) {
  // POST /api/user/like
  console.log('likeSong', songId);
  // const res = await axios.post('/api/user/like', { songId });
  return true;
}

export async function unlikeSong(songId: string) {
  // POST /api/user/unlike
  console.log('unlikeSong', songId);
  // const res = await axios.post('/api/user/unlike', { songId });
  return false;
}
