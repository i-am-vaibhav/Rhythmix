import axios from 'axios';
import type { LoginRequest } from './authStore';
import type { SignupFormData } from './signupStore';

const API_BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

// Server Response
export interface ServerResponse {
  status: number,
  data: any
}

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
      mobile,
      preferences:{
        genres: genres.join(","),
        languages: languages.join(","),
        artists: artists.join(",")
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