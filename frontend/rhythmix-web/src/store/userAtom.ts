import { atom } from 'jotai';

// Atom to store the user data globally
export const userAtom = atom<{ username: string } | null>(null);
