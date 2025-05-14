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
  registerUser: () => Promise<boolean>;
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
    console.log(response);
    if(response.status == 201){
      set({
        message: "User registered successfully with " + response.data.userId,
      });
      return true;
    } else {
      set({
        message: response.data.status,
      })
      return false;
    }
    
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
