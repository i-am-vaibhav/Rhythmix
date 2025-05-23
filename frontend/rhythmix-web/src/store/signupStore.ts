import { create } from 'zustand';
import { register, type ServerResponse } from './backendService';

export interface SignupFormData {
  userName: string;
  email: string;
  password: string;
  mobile: string;
  genres: string[];
  languages: string[];
  artists: string[];
}

export interface UserRegResponse {
  userId: string;
}

interface SignupStore {
  formData: SignupFormData;
  message: string;
  setFormData: (data: Partial<SignupFormData>) => void;
  registerUser: () => Promise<any>;
  resetForm: () => void;
}

export const useSignupStore = create<SignupStore>((set,get) => ({
  formData: {
    userName: '',
    email: '',
    password: '',
    mobile: '',
    genres: [],
    languages: [],
    artists: [],
  },
  message: "",

  setFormData: (data) => set((state) => ({
    formData: {
      ...state.formData,
      ...data,
    },
  })),

  registerUser: async () => {
    const { formData } = get();
    const response: ServerResponse = await register(formData);
    if (response.status == 201){
      localStorage.setItem("userToken", JSON.stringify(response.data));
    }
    return response;
  },

  resetForm: () => set({
    formData: {
      userName: '',
      email: '',
      password: '',
      mobile: '',
      genres: [],
      languages: [],
      artists: [],
    },
  }),
}));
