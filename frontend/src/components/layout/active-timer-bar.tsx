"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useTimerStore } from "@/stores/timer-store";

export const TIMER_UPDATED_EVENT = "growthos:timer-updated";

export function notifyTimerUpdated() {
  window.dispatchEvent(new Event(TIMER_UPDATED_EVENT));
}

function formatElapsed(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function ActiveTimerBar() {
  const session = useTimerStore((state) => state.activeTimer);
  const elapsed = useTimerStore((state) => state.elapsedSeconds);
  const isBusy = useTimerStore((state) => state.isLoading);
  const error = useTimerStore((state) => state.error);
  const fetchActiveTimer = useTimerStore((state) => state.fetchActiveTimer);
  const pauseTimer = useTimerStore((state) => state.pauseTimer);
  const resumeTimer = useTimerStore((state) => state.resumeTimer);
  const stopTimer = useTimerStore((state) => state.stopTimer);
  const tick = useTimerStore((state) => state.tick);

  useEffect(() => {
    void fetchActiveTimer();

    function handleTimerUpdated() {
      void fetchActiveTimer();
    }

    window.addEventListener(TIMER_UPDATED_EVENT, handleTimerUpdated);
    return () => window.removeEventListener(TIMER_UPDATED_EVENT, handleTimerUpdated);
  }, [fetchActiveTimer]);

  useEffect(() => {
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [tick]);

  async function handlePause() {
    if (!session) {
      return;
    }

    try {
      await pauseTimer(session.taskId);
      notifyTimerUpdated();
    } catch {
      return;
    }
  }

  async function handleResume() {
    if (!session) {
      return;
    }

    try {
      await resumeTimer(session.taskId);
      notifyTimerUpdated();
    } catch {
      return;
    }
  }

  async function handleStop() {
    if (!session) {
      return;
    }

    try {
      await stopTimer(session.taskId);
      notifyTimerUpdated();
    } catch {
      return;
    }
  }

  if (!session && !error) {
    return null;
  }

  return (
    <section aria-label="Active timer" className="border-b border-border bg-muted/40">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        {session ? (
          <>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{session.task.title}</p>
              <p className="truncate text-xs text-muted-foreground">{session.task.project.name}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-lg font-semibold tabular-nums text-foreground">{formatElapsed(elapsed)}</p>
              {session.status === "RUNNING" ? (
                <Button disabled={isBusy} onClick={() => void handlePause()} size="sm" type="button" variant="outline">
                  Pause
                </Button>
              ) : (
                <Button disabled={isBusy} onClick={() => void handleResume()} size="sm" type="button" variant="outline">
                  Resume
                </Button>
              )}
              <Button disabled={isBusy} onClick={() => void handleStop()} size="sm" type="button" variant="ghost">
                Stop
              </Button>
            </div>
          </>
        ) : null}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>
    </section>
  );
}
