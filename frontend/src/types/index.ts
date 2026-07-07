export type AppRoute = {
  href: string;
  label: string;
};

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: SafeUser;
};

export type UserResponse = {
  user: SafeUser;
};

export type ProjectStatus = "ACTIVE" | "ARCHIVED";

export type TaskStatus = "PLANNED" | "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "CANCELLED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TimeSessionStatus = "RUNNING" | "PAUSED" | "COMPLETED";

export type Project = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  color: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  _count: {
    tasks: number;
  };
};

export type TaskProject = {
  id: string;
  name: string;
  color: string | null;
  status: ProjectStatus;
};

export type Task = {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  description: string | null;
  scheduledDate: string;
  estimatedMinutes: number;
  priority: TaskPriority;
  status: TaskStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  project: TaskProject;
};

export type TimerTaskSummary = {
  id: string;
  title: string;
  status: TaskStatus;
  project: TaskProject;
};

export type TimeSession = {
  id: string;
  userId: string;
  taskId: string;
  startedAt: string;
  pausedAt: string | null;
  endedAt: string | null;
  durationSeconds: number;
  elapsedSeconds: number;
  status: TimeSessionStatus;
  createdAt: string;
  updatedAt: string;
  task: TimerTaskSummary;
};

export type ActiveTimerResponse = {
  session: TimeSession | null;
};

export type TimeByProject = {
  projectId: string;
  projectName: string;
  color: string | null;
  durationSeconds: number;
};

export type TodayTaskPreview = {
  id: string;
  title: string;
  status: TaskStatus;
  estimatedMinutes: number;
  project: TaskProject;
};

export type AnalyticsSummary = {
  todayFocusSeconds: number;
  todayCompletedTasks: number;
  weeklyFocusSeconds: number;
  activeProjects: number;
  timeByProject: TimeByProject[];
  todayTasks: TodayTaskPreview[];
};

export type DailyAnalytics = {
  date: string;
  focusSeconds: number;
  completedTasks: number;
  plannedTasks: number;
  estimatedMinutes: number;
  actualSeconds: number;
  plannedVsActual: number;
};

export type WeeklyAnalyticsDay = {
  date: string;
  focusSeconds: number;
  completedTasks: number;
};

export type WeeklyAnalytics = {
  from: string;
  to: string;
  days: WeeklyAnalyticsDay[];
  totalFocusSeconds: number;
  totalCompletedTasks: number;
};

export type LogRow = {
  date: string;
  taskId: string;
  taskTitle: string;
  projectId: string;
  projectName: string;
  projectColor: string | null;
  estimatedMinutes: number;
  actualSeconds: number;
  status: TaskStatus;
  completedAt: string | null;
};

export type CreateProjectInput = {
  name: string;
  description?: string;
  color?: string;
};

export type UpdateProjectInput = Partial<CreateProjectInput> & {
  status?: ProjectStatus;
};

export type CreateTaskInput = {
  projectId: string;
  title: string;
  description?: string;
  scheduledDate: string;
  estimatedMinutes: number;
  priority: TaskPriority;
  status?: TaskStatus;
};

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  status?: TaskStatus;
};
