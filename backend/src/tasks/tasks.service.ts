import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, TaskStatus } from "@prisma/client";

import { ProjectsService } from "../projects/projects.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TasksQueryDto } from "./dto/tasks-query.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

const taskSummarySelect = {
  id: true,
  userId: true,
  projectId: true,
  title: true,
  description: true,
  scheduledDate: true,
  estimatedMinutes: true,
  priority: true,
  status: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
  project: {
    select: {
      id: true,
      name: true,
      color: true,
      status: true,
    },
  },
} satisfies Prisma.TaskSelect;

export type TaskSummary = Prisma.TaskGetPayload<{
  select: typeof taskSummarySelect;
}>;

function toStoredDate(input: string) {
  return input.length === 10 ? new Date(`${input}T00:00:00.000Z`) : new Date(input);
}

function toDateRange(date: string) {
  const start = toStoredDate(date);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectsService: ProjectsService,
  ) {}

  async list(userId: string, query: TasksQueryDto) {
    const where: Prisma.TaskWhereInput = { userId };

    if (query.projectId) {
      await this.projectsService.ensureOwnedProject(userId, query.projectId);
      where.projectId = query.projectId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.date) {
      const { start, end } = toDateRange(query.date);
      where.scheduledDate = {
        gte: start,
        lt: end,
      };
    }

    return this.prisma.task.findMany({
      where,
      select: taskSummarySelect,
      orderBy: [{ scheduledDate: "asc" }, { createdAt: "asc" }],
    });
  }

  async getById(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      select: taskSummarySelect,
    });

    if (!task) {
      throw new NotFoundException("Task not found.");
    }

    return task;
  }

  async create(userId: string, dto: CreateTaskDto) {
    await this.projectsService.ensureOwnedProject(userId, dto.projectId);

    return this.prisma.task.create({
      data: {
        userId,
        projectId: dto.projectId,
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        scheduledDate: toStoredDate(dto.scheduledDate),
        estimatedMinutes: dto.estimatedMinutes,
        priority: dto.priority,
        status: dto.status ?? TaskStatus.PLANNED,
        completedAt: dto.status === TaskStatus.COMPLETED ? new Date() : null,
      },
      select: taskSummarySelect,
    });
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    await this.ensureOwnedTask(userId, id);

    if (dto.projectId) {
      await this.projectsService.ensureOwnedProject(userId, dto.projectId);
    }

    const nextStatus = dto.status;

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.projectId !== undefined ? { projectId: dto.projectId } : {}),
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.description !== undefined ? { description: dto.description?.trim() || null } : {}),
        ...(dto.scheduledDate !== undefined ? { scheduledDate: toStoredDate(dto.scheduledDate) } : {}),
        ...(dto.estimatedMinutes !== undefined ? { estimatedMinutes: dto.estimatedMinutes } : {}),
        ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
        ...(nextStatus !== undefined ? { status: nextStatus } : {}),
        ...(nextStatus !== undefined
          ? {
              completedAt: nextStatus === TaskStatus.COMPLETED ? new Date() : null,
            }
          : {}),
      },
      select: taskSummarySelect,
    });
  }

  async complete(userId: string, id: string) {
    await this.ensureOwnedTask(userId, id);

    return this.prisma.task.update({
      where: { id },
      data: {
        status: TaskStatus.COMPLETED,
        completedAt: new Date(),
      },
      select: taskSummarySelect,
    });
  }

  async remove(userId: string, id: string) {
    await this.ensureOwnedTask(userId, id);
    await this.prisma.task.delete({
      where: { id },
    });

    return {
      success: true,
    };
  }

  async ensureOwnedTask(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!task) {
      throw new NotFoundException("Task not found.");
    }

    return task;
  }
}
