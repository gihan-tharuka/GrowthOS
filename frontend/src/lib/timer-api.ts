import type { ActiveTimerResponse, TimeSession } from "@/types";

import { authenticatedApiRequest } from "./api";

export function startTimer(taskId: string) {
  return authenticatedApiRequest<TimeSession>(`/tasks/${taskId}/timer/start`, {
    method: "POST",
  });
}

export function pauseTimer(taskId: string) {
  return authenticatedApiRequest<TimeSession>(`/tasks/${taskId}/timer/pause`, {
    method: "POST",
  });
}

export function resumeTimer(taskId: string) {
  return authenticatedApiRequest<TimeSession>(`/tasks/${taskId}/timer/resume`, {
    method: "POST",
  });
}

export function stopTimer(taskId: string) {
  return authenticatedApiRequest<TimeSession>(`/tasks/${taskId}/timer/stop`, {
    method: "POST",
  });
}

export function getActiveTimer() {
  return authenticatedApiRequest<ActiveTimerResponse>("/timer/active");
}

export function getTaskSessions(taskId: string) {
  return authenticatedApiRequest<TimeSession[]>(`/tasks/${taskId}/sessions`);
}
