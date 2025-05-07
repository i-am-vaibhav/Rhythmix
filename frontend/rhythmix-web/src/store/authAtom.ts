import { atom } from "jotai";

// Define a type for the user's data
export interface UserData {
  username: string;
  email?: string;
  mobile?: string;
  [key: string]: any; // extendable for future user fields
}

// Define the shape of the authentication state
export interface AuthState {
  isAuthenticated: boolean;
  userData: UserData | null;
}

// Default state
export const authAtom = atom<AuthState>({
  isAuthenticated: false,
  userData: null,
});
