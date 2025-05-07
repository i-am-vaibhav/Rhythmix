import { atom } from 'jotai';

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  mobile: string;
  genres?: string[];
  languages?: string[];
  artists?: string[];
}

export const signupFormAtom = atom<SignupFormData>({
  username: '',
  email: '',
  password: '',
  mobile: '',
});
