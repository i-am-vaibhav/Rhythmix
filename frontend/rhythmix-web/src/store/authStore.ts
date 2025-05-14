import { create } from 'zustand';
import { login, type ServerResponse } from './backendService';
import type { SignupFormData } from './signupStore';

export interface LoginRequest{
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userData: SignupFormData;
}

export interface AuthState {
  isAuthenticated: boolean;
  userData: SignupFormData | null;
  message: string;
}

interface AuthStore extends AuthState {
  login: (loginRequest: LoginRequest) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  userData: null,
  isLoggedOut: false,
  message: "",

  login: async (loginRequest) =>{
    const response : ServerResponse = await login(loginRequest);
    if (response.status == 200){
      set({
        isAuthenticated: true,
        userData: response.data.userData,
        message: "",
      });
      localStorage.setItem("userToken", JSON.stringify(response.data));
      return true;
    } else {
      set({
        isAuthenticated: false,
        userData: null,
        message: response.data.status,
      });
      return false;
    }
  },

  logout: () => {
    set({
      isAuthenticated: false,
      userData: null,
      message: "You have logged out successfully",
    })
    localStorage.removeItem("userToken");
  },
  
}));
