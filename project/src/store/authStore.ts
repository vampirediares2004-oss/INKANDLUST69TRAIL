import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import bcrypt from 'bcryptjs';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, passcode: string) => Promise<boolean>;
  register: (username: string, passcode: string) => Promise<boolean>;
  logout: () => void;
  updateStatus: (status: string) => Promise<void>;
  updateOnlineStatus: (isOnline: boolean) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (username: string, passcode: string) => {
        set({ isLoading: true });
        try {
          const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .limit(1)
            .single();

          if (error) {
            set({ isLoading: false });
            return false;
          }

          const isValidPasscode = await bcrypt.compare(passcode, users.passcode_hash);
          if (!isValidPasscode) {
            set({ isLoading: false });
            return false;
          }

          // Update online status
          await supabase
            .from('users')
            .update({ is_online: true, last_seen: new Date().toISOString() })
            .eq('id', users.id);

          set({
            user: { ...users, is_online: true },
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      register: async (username: string, passcode: string) => {
        set({ isLoading: true });
        try {
          // Check if username exists
          const { data: existingUsers, error: checkError } = await supabase
            .from('users')
            .select('id')
            .eq('username', username)
            .limit(1);

          if (existingUsers && existingUsers.length > 0) {
            set({ isLoading: false });
            return false;
          }

          const hashedPasscode = await bcrypt.hash(passcode, 12);
          const { data: newUser, error } = await supabase
            .from('users')
            .insert({
              username,
              passcode_hash: hashedPasscode,
              is_online: true,
              last_seen: new Date().toISOString(),
            })
            .select()
            .single();

          if (error || !newUser) {
            set({ isLoading: false });
            return false;
          }

          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        const { user } = get();
        if (user) {
          supabase
            .from('users')
            .update({ is_online: false, last_seen: new Date().toISOString() })
            .eq('id', user.id);
        }
        set({ user: null, isAuthenticated: false });
      },

      updateStatus: async (status: string) => {
        const { user } = get();
        if (!user) return;

        const { error } = await supabase
          .from('users')
          .update({ status })
          .eq('id', user.id);

        if (!error) {
          set({ user: { ...user, status } });
        }
      },

      updateOnlineStatus: async (isOnline: boolean) => {
        const { user } = get();
        if (!user) return;

        const { error } = await supabase
          .from('users')
          .update({ 
            is_online: isOnline, 
            last_seen: new Date().toISOString() 
          })
          .eq('id', user.id);

        if (!error) {
          set({ user: { ...user, is_online: isOnline } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);