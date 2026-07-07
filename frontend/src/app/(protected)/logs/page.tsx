"use client";

import { FormEvent, useEffect, useState } from "react";

import { TaskStatusBadge } from "@/components/planner/task-status-badge";
import { Button } from "@/components/ui/button";
import { daysAgoString, formatShortDate, todayString } from "@/lib/date-utils";
import { formatMinutes, formatSeconds } from "@/lib/format";
import { listLogs } from "@/lib/logs-api";
import { listProjects } from "@/lib/projects-api";
import type { LogRow, Project } from "@/types";

export default function LogsPage() {
  const [from, setFrom] = useState(() => daysAgoString(6));
  const [to, setTo] = useState(todayString);
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadLogs(nextFrom = from, nextTo = to, nextProjectId = projectId) {
    try {
      setIsLoading(true);
      setError(null);
      const [nextProjects, nextLogs] = await Promise.all([
        listProjects(),
        listLogs({
          from: nextFrom,
          to: nextTo,
          projectId: nextProjectId || undefined,
        }),
      ]);
      setProjects(nextProjects);
      setLogs(nextLogs);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load logs.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadLogs();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadLogs();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">Logs</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-foreground">Focus and task history</h1>
        <p className="mt-3 text-muted-foreground">
          Review completed work, planned estimates, and tracked time across your recent tasks.
        </p>
      </section>

      <form className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-5 md:grid-cols-[1fr_1fr_1fr_auto]" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="logs-from">
            From
          </label>
          <input
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
            id="logs-from"
            onChange={(event) => setFrom(event.target.value)}
            type="date"
            value={from}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="logs-to">
            To
          </label>
          <input
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
            id="logs-to"
            onChange={(event) => setTo(event.target.value)}
            type="date"
            value={to}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="logs-project">
            Project
          </label>
          <select
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
            id="logs-project"
            onChange={(event) => setProjectId(event.target.value)}
            value={projectId}
          >
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button className="w-full" disabled={isLoading} type="submit">
            Filter
          </Button>
        </div>
      </form>

      {error ? <p className="mt-6 text-sm text-red-700">{error}</p> : null}
      {isLoading ? <p className="mt-6 text-sm text-muted-foreground">Loading logs...</p> : null}

      {!isLoading && logs.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center">
          <h2 className="text-lg font-semibold text-foreground">No logs for this range</h2>
          <p className="mt-2 text-sm text-muted-foreground">Track time or complete tasks to build your logs.</p>
        </div>
      ) : null}

      {logs.length > 0 ? (
        <section className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Task</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Estimate</th>
                  <th className="px-4 py-3 font-medium">Actual</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((row) => (
                  <tr className="border-b border-border last:border-b-0" key={`${row.taskId}-${row.date}`}>
                    <td className="px-4 py-4 text-muted-foreground">{formatShortDate(row.date)}</td>
                    <td className="px-4 py-4 font-medium text-foreground">{row.taskTitle}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full border border-border"
                          style={{ backgroundColor: row.projectColor ?? "#94a3b8" }}
                        />
                        <span className="text-foreground">{row.projectName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{formatMinutes(row.estimatedMinutes)}</td>
                    <td className="px-4 py-4 text-muted-foreground">{formatSeconds(row.actualSeconds)}</td>
                    <td className="px-4 py-4">
                      <TaskStatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </main>
  );
}
