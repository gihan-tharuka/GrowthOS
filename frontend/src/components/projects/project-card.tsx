"use client";

import { Button } from "@/components/ui/button";
import type { Project } from "@/types";

type ProjectCardProps = {
  project: Project;
  isBusy?: boolean;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
};

export function ProjectCard({ project, isBusy = false, onEdit, onArchive, onDelete }: ProjectCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full border border-black/10"
              style={{ backgroundColor: project.color ?? "#94a3b8" }}
            />
            <h2 className="truncate text-lg font-semibold text-foreground">{project.name}</h2>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {project.status === "ARCHIVED" ? "Archived" : "Active"}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {project.description || "No description yet."}
          </p>
        </div>
        <div className="rounded-md bg-muted px-3 py-2 text-right">
          <p className="text-xs uppercase tracking-normal text-muted-foreground">Tasks</p>
          <p className="text-lg font-semibold text-foreground">{project._count.tasks}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button disabled={isBusy} onClick={onEdit} size="sm" type="button" variant="outline">
          Edit
        </Button>
        <Button
          disabled={isBusy || project.status === "ARCHIVED"}
          onClick={onArchive}
          size="sm"
          type="button"
          variant="outline"
        >
          Archive
        </Button>
        <Button disabled={isBusy} onClick={onDelete} size="sm" type="button" variant="ghost">
          Delete
        </Button>
      </div>
    </article>
  );
}
