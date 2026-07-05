import type { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from "@/types";

import { authenticatedApiRequest } from "./api";

type ListTasksParams = {
  date?: string;
  projectId?: string;
  status?: TaskStatus;
};

function toQueryString(params: ListTasksParams) {
  const searchParams = new URLSearchParams();

  if (params.date) {
    searchParams.set("date", params.date);
  }

  if (params.projectId) {
    searchParams.set("projectId", params.projectId);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function listTasks(params: ListTasksParams = {}) {
  return authenticatedApiRequest<Task[]>(`/tasks${toQueryString(params)}`);
}

export function createTask(input: CreateTaskInput) {
  return authenticatedApiRequest<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getTask(id: string) {
  return authenticatedApiRequest<Task>(`/tasks/${id}`);
}

export function updateTask(id: string, input: UpdateTaskInput) {
  return authenticatedApiRequest<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function completeTask(id: string) {
  return authenticatedApiRequest<Task>(`/tasks/${id}/complete`, {
    method: "PATCH",
  });
}

export function deleteTask(id: string) {
  return authenticatedApiRequest<{ success: true }>(`/tasks/${id}`, {
    method: "DELETE",
  });
}
