"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import type { CreateProjectInput, Project } from "@/types";

type ProjectFormProps = {
  initialValues?: Partial<Project>;
  submitLabel: string;
  isSubmitting?: boolean;
  error?: string | null;
  onSubmit: (values: CreateProjectInput) => Promise<void> | void;
  onCancel?: () => void;
};

type ProjectFormValues = {
  name: string;
  description: string;
  color: string;
};

function normalizeInitialValues(initialValues?: Partial<Project>): ProjectFormValues {
  return {
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    color: initialValues?.color ?? "#0f766e",
  };
}

function validate(values: ProjectFormValues) {
  if (values.name.trim().length < 2 || values.name.trim().length > 80) {
    return "Project name must be between 2 and 80 characters.";
  }

  return null;
}

export function ProjectForm({
  initialValues,
  submitLabel,
  isSubmitting = false,
  error,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [values, setValues] = useState(() => normalizeInitialValues(initialValues));
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
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      color: values.color.trim() || undefined,
    });

    if (!initialValues) {
      setValues({
        name: "",
        description: "",
        color: "#0f766e",
      });
    }
  }

  return (
    <form className="space-y-4 rounded-lg border border-border bg-card p-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-[1fr_160px]">
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="project-name">
            Project name
          </label>
          <input
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
            id="project-name"
            maxLength={80}
            onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
            placeholder="Growth site redesign"
            value={values.name}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="project-color">
            Color
          </label>
          <input
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-2"
            id="project-color"
            onChange={(event) => setValues((current) => ({ ...current, color: event.target.value }))}
            type="color"
            value={values.color}
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground" htmlFor="project-description">
          Description
        </label>
        <textarea
          className="mt-2 min-h-24 w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
          id="project-description"
          maxLength={500}
          onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
          placeholder="Optional notes about this project."
          value={values.description}
        />
      </div>
      {validationError ? <p className="text-sm text-red-700">{validationError}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Button disabled={isSubmitting} type="submit">
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
