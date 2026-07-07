"use client";

import { useEffect, useState } from "react";

import { DailySummary } from "@/components/planner/daily-summary";
import { DateSelector } from "@/components/planner/date-selector";
import { notifyTimerUpdated, TIMER_UPDATED_EVENT } from "@/components/layout/active-timer-bar";
import { TaskCard } from "@/components/planner/task-card";
import { TaskForm } from "@/components/planner/task-form";
import { listProjects } from "@/lib/projects-api";
import { completeTask, createTask, deleteTask, listTasks, updateTask } from "@/lib/tasks-api";
import { pauseTimer, resumeTimer, startTimer, stopTimer } from "@/lib/timer-api";
import type { CreateTaskInput, Project, Task } from "@/types";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  async function loadPlannerData() {
    try {
      setIsLoading(true);
      setPageError(null);
      const [nextProjects, nextTasks] = await Promise.all([
        listProjects(),
        listTasks({ date: selectedDate }),
      ]);
      setProjects(nextProjects.filter((project) => project.status === "ACTIVE"));
      setTasks(nextTasks);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to load planner data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPlannerData();
  }, [selectedDate]);

  useEffect(() => {
    function handleTimerUpdated() {
      void loadPlannerData();
    }

    window.addEventListener(TIMER_UPDATED_EVENT, handleTimerUpdated);
    return () => window.removeEventListener(TIMER_UPDATED_EVENT, handleTimerUpdated);
  }, [selectedDate]);

  async function handleCreate(values: CreateTaskInput) {
    try {
      setIsCreating(true);
      setFormError(null);
      const task = await createTask(values);
      setTasks((current) => [...current, task].sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to create task.");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdate(taskId: string, values: Partial<CreateTaskInput>) {
    try {
      setBusyId(taskId);
      setFormError(null);
      const updated = await updateTask(taskId, values);
      setTasks((current) => current.map((task) => (task.id === taskId ? updated : task)));
      setEditingId(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to update task.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleComplete(taskId: string) {
    try {
      setBusyId(taskId);
      const updated = await completeTask(taskId);
      setTasks((current) => current.map((task) => (task.id === taskId ? updated : task)));
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to complete task.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(taskId: string) {
    try {
      setBusyId(taskId);
      await deleteTask(taskId);
      setTasks((current) => current.filter((task) => task.id !== taskId));
      if (editingId === taskId) {
        setEditingId(null);
      }
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to delete task.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleTimerAction(taskId: string, action: "start" | "pause" | "resume" | "stop") {
    try {
      setBusyId(taskId);
      setPageError(null);

      if (action === "start") {
        await startTimer(taskId);
      }

      if (action === "pause") {
        await pauseTimer(taskId);
      }

      if (action === "resume") {
        await resumeTimer(taskId);
      }

      if (action === "stop") {
        await stopTimer(taskId);
      }

      await loadPlannerData();
      notifyTimerUpdated();
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to update timer.");
    } finally {
      setBusyId(null);
    }
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED").length;
  const totalEstimatedMinutes = tasks.reduce((total, task) => total + task.estimatedMinutes, 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">Planner</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-foreground">Shape the day before it slips</h1>
        <p className="mt-3 text-muted-foreground">
          Pick a date, slot work into real projects, and keep the day honest with a clean view of what is planned.
        </p>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <DateSelector onChange={setSelectedDate} value={selectedDate} />
          <DailySummary
            completedTasks={completedTasks}
            totalEstimatedMinutes={totalEstimatedMinutes}
            totalTasks={totalTasks}
          />
        </div>
        <div className="space-y-4">
          {projects.length === 0 && !isLoading ? (
            <div className="rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center">
              <h2 className="text-lg font-semibold text-foreground">Create a project first</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Tasks must belong to one of your projects, so add a project before planning the day.
              </p>
            </div>
          ) : (
            <TaskForm
              error={formError}
              isSubmitting={isCreating}
              onSubmit={handleCreate}
              projects={projects}
              selectedDate={selectedDate}
              submitLabel="Add task"
            />
          )}
        </div>
      </section>

      {pageError ? <p className="mt-6 text-sm text-red-700">{pageError}</p> : null}

      <section className="mt-8 space-y-4">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading tasks...</p> : null}
        {!isLoading && tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center">
            <h2 className="text-lg font-semibold text-foreground">Nothing planned for this date</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a task for {selectedDate} and the planner will build the day summary automatically.
            </p>
          </div>
        ) : null}
        {tasks.map((task) =>
          editingId === task.id ? (
            <TaskForm
              error={formError}
              initialValues={task}
              isSubmitting={busyId === task.id}
              key={task.id}
              onCancel={() => {
                setEditingId(null);
                setFormError(null);
              }}
              onSubmit={(values) => handleUpdate(task.id, values)}
              projects={projects}
              selectedDate={selectedDate}
              submitLabel="Save task"
            />
          ) : (
            <TaskCard
              isBusy={busyId === task.id}
              key={task.id}
              onComplete={() => void handleComplete(task.id)}
              onDelete={() => void handleDelete(task.id)}
              onEdit={() => {
                setEditingId(task.id);
                setFormError(null);
              }}
              onPauseTimer={() => void handleTimerAction(task.id, "pause")}
              onResumeTimer={() => void handleTimerAction(task.id, "resume")}
              onStartTimer={() => void handleTimerAction(task.id, "start")}
              onStopTimer={() => void handleTimerAction(task.id, "stop")}
              task={task}
            />
          ),
        )}
      </section>
    </main>
  );
}
