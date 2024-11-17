import { create } from 'zustand';
import { AuthStore, User } from '@/types';
import { db } from '@/lib/db';

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await db.users.where('email').equals(email).first();
      
      if (!user || user.password !== password) {
        throw new Error('Invalid email or password');
      }

      set({ 
        user: { 
          id: user.id!,
          email: user.email,
          password: user.password,
          name: user.name
        },
        isLoading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const existingUser = await db.users.where('email').equals(email).first();
      
      if (existingUser) {
        throw new Error('Email already exists');
      }

      const id = await db.users.add({
        email,
        password,
        name
      });

      set({ 
        user: { id: id.toString(), email, password, name },
        isLoading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, error: null });
  },
}));