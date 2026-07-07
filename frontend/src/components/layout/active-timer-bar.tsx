"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getActiveTimer, pauseTimer, resumeTimer, stopTimer } from "@/lib/timer-api";
import type { TimeSession } from "@/types";

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

function getElapsedSeconds(session: TimeSession, now: number) {
  if (session.status !== "RUNNING") {
    return session.elapsedSeconds;
  }

  const startedAt = new Date(session.startedAt).getTime();
  return session.durationSeconds + Math.max(0, Math.floor((now - startedAt) / 1000));
}

export function ActiveTimerBar() {
  const [session, setSession] = useState<TimeSession | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadActiveTimer() {
    try {
      const response = await getActiveTimer();
      setSession(response.session);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load active timer.");
    }
  }

  useEffect(() => {
    void loadActiveTimer();

    function handleTimerUpdated() {
      void loadActiveTimer();
    }

    window.addEventListener(TIMER_UPDATED_EVENT, handleTimerUpdated);
    return () => window.removeEventListener(TIMER_UPDATED_EVENT, handleTimerUpdated);
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const elapsed = useMemo(() => (session ? getElapsedSeconds(session, now) : 0), [now, session]);

  async function handlePause() {
    if (!session) {
      return;
    }

    try {
      setIsBusy(true);
      setError(null);
      setSession(await pauseTimer(session.taskId));
      notifyTimerUpdated();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to pause timer.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleResume() {
    if (!session) {
      return;
    }

    try {
      setIsBusy(true);
      setError(null);
      setSession(await resumeTimer(session.taskId));
      notifyTimerUpdated();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to resume timer.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleStop() {
    if (!session) {
      return;
    }

    try {
      setIsBusy(true);
      setError(null);
      await stopTimer(session.taskId);
      setSession(null);
      notifyTimerUpdated();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to stop timer.");
    } finally {
      setIsBusy(false);
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
