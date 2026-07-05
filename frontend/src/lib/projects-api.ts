import type { CreateProjectInput, Project, UpdateProjectInput } from "@/types";

import { authenticatedApiRequest } from "./api";

export function listProjects() {
  return authenticatedApiRequest<Project[]>("/projects");
}

export function createProject(input: CreateProjectInput) {
  return authenticatedApiRequest<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getProject(id: string) {
  return authenticatedApiRequest<Project>(`/projects/${id}`);
}

export function updateProject(id: string, input: UpdateProjectInput) {
  return authenticatedApiRequest<Project>(`/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function archiveProject(id: string) {
  return authenticatedApiRequest<Project>(`/projects/${id}/archive`, {
    method: "PATCH",
  });
}

export function deleteProject(id: string) {
  return authenticatedApiRequest<{ success: true }>(`/projects/${id}`, {
    method: "DELETE",
  });
}
