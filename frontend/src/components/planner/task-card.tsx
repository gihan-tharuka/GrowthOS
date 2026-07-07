"use client";

import { Button } from "@/components/ui/button";
import { TaskPriorityBadge } from "@/components/planner/task-priority-badge";
import { TaskStatusBadge } from "@/components/planner/task-status-badge";
import type { Task } from "@/types";

type TaskCardProps = {
  task: Task;
  isBusy?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onStopTimer: () => void;
};

export function TaskCard({
  task,
  isBusy = false,
  onEdit,
  onDelete,
  onComplete,
  onStartTimer,
  onPauseTimer,
  onResumeTimer,
  onStopTimer,
}: TaskCardProps) {
  const canStartTimer = task.status === "PLANNED";
  const canPauseTimer = task.status === "IN_PROGRESS";
  const canResumeTimer = task.status === "PAUSED";
  const canStopTimer = task.status === "IN_PROGRESS" || task.status === "PAUSED";
  const hasActiveTimerStatus = task.status === "IN_PROGRESS" || task.status === "PAUSED";

  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{task.title}</h2>
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">{task.project.name}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{task.description || "No description yet."}</p>
        </div>
        <div className="rounded-md bg-muted px-3 py-2 text-right">
          <p className="text-xs uppercase tracking-normal text-muted-foreground">Estimate</p>
          <p className="text-lg font-semibold text-foreground">{task.estimatedMinutes} min</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {canStartTimer ? (
          <Button disabled={isBusy} onClick={onStartTimer} size="sm" type="button">
            Start
          </Button>
        ) : null}
        {canPauseTimer ? (
          <Button disabled={isBusy} onClick={onPauseTimer} size="sm" type="button" variant="outline">
            Pause
          </Button>
        ) : null}
        {canResumeTimer ? (
          <Button disabled={isBusy} onClick={onResumeTimer} size="sm" type="button">
            Resume
          </Button>
        ) : null}
        {canStopTimer ? (
          <Button disabled={isBusy} onClick={onStopTimer} size="sm" type="button" variant="outline">
            Stop
          </Button>
        ) : null}
        <Button disabled={isBusy} onClick={onEdit} size="sm" type="button" variant="outline">
          Edit
        </Button>
        <Button
          disabled={isBusy || task.status === "COMPLETED" || hasActiveTimerStatus}
          onClick={onComplete}
          size="sm"
          type="button"
          variant="outline"
        >
          Complete
        </Button>
        <Button disabled={isBusy} onClick={onDelete} size="sm" type="button" variant="ghost">
          Delete
        </Button>
      </div>
    </article>
  );
}
