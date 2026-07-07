import { create } from "zustand";

import { me } from "@/lib/auth-api";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/auth-token";
import type { SafeUser } from "@/types";

type AuthState = {
  user: SafeUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrateAuth: () => Promise<void>;
  setAuth: (token: string, user: SafeUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  hydrateAuth: async () => {
    const token = getAccessToken();

    if (!token) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    set({ token, isLoading: true });

    try {
      const response = await me(token);
      set({
        user: response.user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      clearAccessToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
  setAuth: (token, user) => {
    setAccessToken(token);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },
  logout: () => {
    clearAccessToken();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
