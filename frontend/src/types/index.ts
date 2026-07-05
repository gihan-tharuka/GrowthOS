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
