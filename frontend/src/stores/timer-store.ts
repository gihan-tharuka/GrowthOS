import { create } from "zustand";

import {
  getActiveTimer,
  pauseTimer as pauseTimerRequest,
  resumeTimer as resumeTimerRequest,
  startTimer as startTimerRequest,
  stopTimer as stopTimerRequest,
} from "@/lib/timer-api";
import type { TimeSession } from "@/types";

type TimerState = {
  activeTimer: TimeSession | null;
  elapsedSeconds: number;
  isLoading: boolean;
  error: string | null;
  fetchActiveTimer: () => Promise<void>;
  startTimer: (taskId: string) => Promise<void>;
  pauseTimer: (taskId: string) => Promise<void>;
  resumeTimer: (taskId: string) => Promise<void>;
  stopTimer: (taskId: string) => Promise<void>;
  clearTimer: () => void;
  tick: () => void;
};

function getElapsedSeconds(session: TimeSession | null) {
  if (!session) {
    return 0;
  }

  if (session.status !== "RUNNING") {
    return session.elapsedSeconds;
  }

  const startedAt = new Date(session.startedAt).getTime();
  return session.durationSeconds + Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  activeTimer: null,
  elapsedSeconds: 0,
  isLoading: false,
  error: null,
  fetchActiveTimer: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getActiveTimer();
      set({
        activeTimer: response.session,
        elapsedSeconds: getElapsedSeconds(response.session),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error, "Unable to load active timer."),
        isLoading: false,
      });
    }
  },
  startTimer: async (taskId) => {
    try {
      set({ isLoading: true, error: null });
      const session = await startTimerRequest(taskId);
      set({
        activeTimer: session,
        elapsedSeconds: getElapsedSeconds(session),
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error, "Unable to start timer."), isLoading: false });
      throw error;
    }
  },
  pauseTimer: async (taskId) => {
    try {
      set({ isLoading: true, error: null });
      const session = await pauseTimerRequest(taskId);
      set({
        activeTimer: session,
        elapsedSeconds: getElapsedSeconds(session),
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error, "Unable to pause timer."), isLoading: false });
      throw error;
    }
  },
  resumeTimer: async (taskId) => {
    try {
      set({ isLoading: true, error: null });
      const session = await resumeTimerRequest(taskId);
      set({
        activeTimer: session,
        elapsedSeconds: getElapsedSeconds(session),
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error, "Unable to resume timer."), isLoading: false });
      throw error;
    }
  },
  stopTimer: async (taskId) => {
    try {
      set({ isLoading: true, error: null });
      await stopTimerRequest(taskId);
      set({
        activeTimer: null,
        elapsedSeconds: 0,
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error, "Unable to stop timer."), isLoading: false });
      throw error;
    }
  },
  clearTimer: () => set({ activeTimer: null, elapsedSeconds: 0, error: null, isLoading: false }),
  tick: () => set({ elapsedSeconds: getElapsedSeconds(get().activeTimer) }),
}));
