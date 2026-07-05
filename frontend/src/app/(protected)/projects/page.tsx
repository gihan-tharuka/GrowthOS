"use client";

import { useEffect, useState } from "react";

import { ProjectCard } from "@/components/projects/project-card";
import { ProjectForm } from "@/components/projects/project-form";
import { archiveProject, createProject, deleteProject, listProjects, updateProject } from "@/lib/projects-api";
import type { CreateProjectInput, Project } from "@/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        setIsLoading(true);
        setPageError(null);
        setProjects(await listProjects());
      } catch (error) {
        setPageError(error instanceof Error ? error.message : "Unable to load projects.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProjects();
  }, []);

  async function handleCreate(values: CreateProjectInput) {
    try {
      setIsCreating(true);
      setFormError(null);
      const project = await createProject(values);
      setProjects((current) => [project, ...current]);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to create project.");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdate(projectId: string, values: CreateProjectInput) {
    try {
      setBusyId(projectId);
      setFormError(null);
      const updated = await updateProject(projectId, values);
      setProjects((current) => current.map((project) => (project.id === projectId ? updated : project)));
      setEditingId(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to update project.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleArchive(projectId: string) {
    try {
      setBusyId(projectId);
      const updated = await archiveProject(projectId);
      setProjects((current) => current.map((project) => (project.id === projectId ? updated : project)));
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to archive project.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(projectId: string) {
    try {
      setBusyId(projectId);
      await deleteProject(projectId);
      setProjects((current) => current.filter((project) => project.id !== projectId));
      if (editingId === projectId) {
        setEditingId(null);
      }
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to delete project.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">Projects</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-foreground">Organize your active work</h1>
        <p className="mt-3 text-muted-foreground">
          Create a few focused projects, keep archived work out of the way, and attach planner tasks to something
          real.
        </p>
      </section>

      <section className="mt-8">
        <ProjectForm error={formError} isSubmitting={isCreating} onSubmit={handleCreate} submitLabel="Create project" />
      </section>

      {pageError ? <p className="mt-6 text-sm text-red-700">{pageError}</p> : null}

      <section className="mt-8 space-y-4">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading projects...</p> : null}
        {!isLoading && projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center">
            <h2 className="text-lg font-semibold text-foreground">No projects yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start with one project so your planner tasks have a home.
            </p>
          </div>
        ) : null}
        {projects.map((project) =>
          editingId === project.id ? (
            <ProjectForm
              error={formError}
              initialValues={project}
              isSubmitting={busyId === project.id}
              key={project.id}
              onCancel={() => {
                setEditingId(null);
                setFormError(null);
              }}
              onSubmit={(values) => handleUpdate(project.id, values)}
              submitLabel="Save changes"
            />
          ) : (
            <ProjectCard
              isBusy={busyId === project.id}
              key={project.id}
              onArchive={() => void handleArchive(project.id)}
              onDelete={() => void handleDelete(project.id)}
              onEdit={() => {
                setEditingId(project.id);
                setFormError(null);
              }}
              project={project}
            />
          ),
        )}
      </section>
    </main>
  );
}
