import { create } from 'zustand';

export interface UserData {
  username: string;
  email?: string;
  mobile?: string;
  [key: string]: any;
}

export interface AuthState {
  isAuthenticated: boolean;
  userData: UserData | null;
  isLoggedOut: boolean;
}

interface AuthStore extends AuthState {
  login: (userData: UserData) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserData>) => void;
  toggleLogoutFlag: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  userData: null,
  isLoggedOut: false,

  toggleLogoutFlag: () => set((state) => ({ isLoggedOut: !state.isLoggedOut })),

  login: (userData) =>
    set({
      isAuthenticated: true,
      userData,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      userData: null,
    }),

  updateUser: (updates) =>
    set((state) => ({
      userData: state.userData
        ? { ...state.userData, ...updates }
        : null,
    })),
}));
