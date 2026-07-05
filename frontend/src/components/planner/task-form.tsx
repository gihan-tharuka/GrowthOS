"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import type { CreateTaskInput, Project, Task, TaskPriority, TaskStatus } from "@/types";

type TaskFormProps = {
  projects: Project[];
  selectedDate: string;
  initialValues?: Partial<Task>;
  submitLabel: string;
  isSubmitting?: boolean;
  error?: string | null;
  onSubmit: (values: CreateTaskInput) => Promise<void> | void;
  onCancel?: () => void;
};

type TaskFormValues = {
  title: string;
  description: string;
  projectId: string;
  scheduledDate: string;
  estimatedMinutes: string;
  priority: TaskPriority;
  status: TaskStatus;
};

function toDateInputValue(value?: string | Date | null) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

function buildInitialValues(
  projects: Project[],
  selectedDate: string,
  initialValues?: Partial<Task>,
): TaskFormValues {
  return {
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    projectId: initialValues?.projectId ?? projects[0]?.id ?? "",
    scheduledDate: toDateInputValue(initialValues?.scheduledDate) || selectedDate,
    estimatedMinutes: initialValues?.estimatedMinutes ? String(initialValues.estimatedMinutes) : "30",
    priority: initialValues?.priority ?? "MEDIUM",
    status: initialValues?.status ?? "PLANNED",
  };
}

function validate(values: TaskFormValues) {
  if (values.title.trim().length < 2 || values.title.trim().length > 120) {
    return "Task title must be between 2 and 120 characters.";
  }

  if (!values.projectId) {
    return "Choose a project for this task.";
  }

  if (!values.scheduledDate) {
    return "Choose a scheduled date.";
  }

  const minutes = Number(values.estimatedMinutes);

  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 720) {
    return "Estimated minutes must be an integer between 1 and 720.";
  }

  return null;
}

export function TaskForm({
  projects,
  selectedDate,
  initialValues,
  submitLabel,
  isSubmitting = false,
  error,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [values, setValues] = useState(() => buildInitialValues(projects, selectedDate, initialValues));
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextError = validate(values);

    if (nextError) {
      setValidationError(nextError);
      return;
    }

    setValidationError(null);
    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim() || undefined,
      projectId: values.projectId,
      scheduledDate: values.scheduledDate,
      estimatedMinutes: Number(values.estimatedMinutes),
      priority: values.priority,
      status: values.status,
    });

    if (!initialValues) {
      setValues((current) => ({
        ...current,
        title: "",
        description: "",
        estimatedMinutes: "30",
        status: "PLANNED",
        priority: "MEDIUM",
      }));
    }
  }

  return (
    <form className="space-y-4 rounded-lg border border-border bg-card p-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="task-title">
            Task title
          </label>
          <input
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
            id="task-title"
            maxLength={120}
            onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
            placeholder="Write launch outline"
            value={values.title}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="task-project">
            Project
          </label>
          <select
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
            id="task-project"
            onChange={(event) => setValues((current) => ({ ...current, projectId: event.target.value }))}
            value={values.projectId}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="task-date">
            Scheduled date
          </label>
          <input
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
            id="task-date"
            onChange={(event) => setValues((current) => ({ ...current, scheduledDate: event.target.value }))}
            type="date"
            value={values.scheduledDate}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="task-minutes">
            Estimated minutes
          </label>
          <input
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
            id="task-minutes"
            max={720}
            min={1}
            onChange={(event) => setValues((current) => ({ ...current, estimatedMinutes: event.target.value }))}
            type="number"
            value={values.estimatedMinutes}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="task-priority">
            Priority
          </label>
          <select
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
            id="task-priority"
            onChange={(event) =>
              setValues((current) => ({ ...current, priority: event.target.value as TaskPriority }))
            }
            value={values.priority}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="task-status">
            Status
          </label>
          <select
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
            id="task-status"
            onChange={(event) => setValues((current) => ({ ...current, status: event.target.value as TaskStatus }))}
            value={values.status}
          >
            <option value="PLANNED">Planned</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="PAUSED">Paused</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground" htmlFor="task-description">
          Description
        </label>
        <textarea
          className="mt-2 min-h-24 w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
          id="task-description"
          maxLength={500}
          onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
          placeholder="Optional details for this task."
          value={values.description}
        />
      </div>
      {validationError ? <p className="text-sm text-red-700">{validationError}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Button disabled={isSubmitting || projects.length === 0} type="submit">
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        {onCancel ? (
          <Button disabled={isSubmitting} onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
