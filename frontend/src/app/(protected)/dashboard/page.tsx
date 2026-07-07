"use client";

import { useEffect, useState } from "react";

import { TaskStatusBadge } from "@/components/planner/task-status-badge";
import { getAnalyticsSummary } from "@/lib/analytics-api";
import { formatMinutes, formatSeconds } from "@/lib/format";
import type { AnalyticsSummary } from "@/types";

type MetricCardProps = {
  label: string;
  value: string | number;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
    </article>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        setIsLoading(true);
        setError(null);
        setSummary(await getAnalyticsSummary());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadSummary();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-foreground">Today at a glance</h1>
        <p className="mt-3 text-muted-foreground">
          A focused snapshot of planned work, completed tasks, and tracked time from your current workspace.
        </p>
      </section>

      {error ? <p className="mt-6 text-sm text-red-700">{error}</p> : null}
      {isLoading ? <p className="mt-6 text-sm text-muted-foreground">Loading dashboard...</p> : null}

      {summary ? (
        <>
          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Today focus" value={formatSeconds(summary.todayFocusSeconds)} />
            <MetricCard label="Today completed" value={summary.todayCompletedTasks} />
            <MetricCard label="Weekly focus" value={formatSeconds(summary.weeklyFocusSeconds)} />
            <MetricCard label="Active projects" value={summary.activeProjects} />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-lg font-semibold text-foreground">Today tasks</h2>
              {summary.todayTasks.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No tasks planned for today yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {summary.todayTasks.map((task) => (
                    <article className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3" key={task.id}>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {task.project.name} · {formatMinutes(task.estimatedMinutes)}
                        </p>
                      </div>
                      <TaskStatusBadge status={task.status} />
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-lg font-semibold text-foreground">Time by project</h2>
              {summary.timeByProject.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">Track a task timer to see project focus here.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {summary.timeByProject.map((project) => (
                    <div className="flex items-center justify-between gap-3 border-t border-border pt-3" key={project.projectId}>
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-3 w-3 shrink-0 rounded-full border border-border"
                          style={{ backgroundColor: project.color ?? "#94a3b8" }}
                        />
                        <p className="truncate text-sm font-medium text-foreground">{project.projectName}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatSeconds(project.durationSeconds)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
