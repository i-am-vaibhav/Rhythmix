import { create } from 'zustand';

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  mobile: string;
  genres?: string[];
  languages?: string[];
  artists?: string[];
}

interface SignupStore {
  formData: SignupFormData;
  setFormData: (data: Partial<SignupFormData>) => void;
  resetForm: () => void;
}

export const useSignupStore = create<SignupStore>((set) => ({
  formData: {
    username: '',
    email: '',
    password: '',
    mobile: '',
    genres: [],
    languages: [],
    artists: [],
  },
  setFormData: (data) => set((state) => ({
    formData: {
      ...state.formData,
      ...data,
    },
  })),
  resetForm: () => set({
    formData: {
      username: '',
      email: '',
      password: '',
      mobile: '',
      genres: [],
      languages: [],
      artists: [],
    },
  }),
}));
