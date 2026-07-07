import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, TaskStatus, TimeSessionStatus } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

const activeSessionStatuses = [TimeSessionStatus.RUNNING, TimeSessionStatus.PAUSED];

const timerSessionSelect = {
  id: true,
  userId: true,
  taskId: true,
  startedAt: true,
  pausedAt: true,
  endedAt: true,
  durationSeconds: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  task: {
    select: {
      id: true,
      title: true,
      status: true,
      project: {
        select: {
          id: true,
          name: true,
          color: true,
          status: true,
        },
      },
    },
  },
} satisfies Prisma.TimeSessionSelect;

type TimerSessionSummary = Prisma.TimeSessionGetPayload<{
  select: typeof timerSessionSelect;
}>;

function secondsBetween(start: Date, end: Date) {
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
}

function withElapsedSeconds(session: TimerSessionSummary | null, now = new Date()) {
  if (!session) {
    return null;
  }

  const runningSeconds =
    session.status === TimeSessionStatus.RUNNING ? secondsBetween(session.startedAt, now) : 0;

  return {
    ...session,
    elapsedSeconds: session.durationSeconds + runningSeconds,
  };
}

@Injectable()
export class TimerService {
  constructor(private readonly prisma: PrismaService) {}

  async start(userId: string, taskId: string) {
    const now = new Date();
    const task = await this.getOwnedTask(userId, taskId);

    if (task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELLED) {
      throw new BadRequestException("Cannot start a timer for a completed or cancelled task.");
    }

    const activeSession = await this.prisma.timeSession.findFirst({
      where: {
        userId,
        status: { in: activeSessionStatuses },
      },
      select: { id: true },
    });

    if (activeSession) {
      throw new ConflictException("You already have an active timer.");
    }

    const session = await this.prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id: taskId },
        data: { status: TaskStatus.IN_PROGRESS },
      });

      return tx.timeSession.create({
        data: {
          userId,
          taskId,
          startedAt: now,
          status: TimeSessionStatus.RUNNING,
        },
        select: timerSessionSelect,
      });
    });

    return withElapsedSeconds(session, now);
  }

  async pause(userId: string, taskId: string) {
    const now = new Date();
    await this.getOwnedTask(userId, taskId);

    const session = await this.prisma.timeSession.findFirst({
      where: {
        userId,
        taskId,
        status: TimeSessionStatus.RUNNING,
      },
      select: timerSessionSelect,
    });

    if (!session) {
      throw new BadRequestException("No running timer found for this task.");
    }

    const nextDuration = session.durationSeconds + secondsBetween(session.startedAt, now);

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id: taskId },
        data: { status: TaskStatus.PAUSED },
      });

      return tx.timeSession.update({
        where: { id: session.id },
        data: {
          durationSeconds: nextDuration,
          pausedAt: now,
          status: TimeSessionStatus.PAUSED,
        },
        select: timerSessionSelect,
      });
    });

    return withElapsedSeconds(updated, now);
  }

  async resume(userId: string, taskId: string) {
    const now = new Date();
    const task = await this.getOwnedTask(userId, taskId);

    if (task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELLED) {
      throw new BadRequestException("Cannot resume a timer for a completed or cancelled task.");
    }

    const session = await this.prisma.timeSession.findFirst({
      where: {
        userId,
        taskId,
        status: TimeSessionStatus.PAUSED,
      },
      select: timerSessionSelect,
    });

    if (!session) {
      throw new BadRequestException("No paused timer found for this task.");
    }

    const otherActiveSession = await this.prisma.timeSession.findFirst({
      where: {
        userId,
        id: { not: session.id },
        status: { in: activeSessionStatuses },
      },
      select: { id: true },
    });

    if (otherActiveSession) {
      throw new ConflictException("You already have an active timer.");
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id: taskId },
        data: { status: TaskStatus.IN_PROGRESS },
      });

      return tx.timeSession.update({
        where: { id: session.id },
        data: {
          startedAt: now,
          pausedAt: null,
          status: TimeSessionStatus.RUNNING,
        },
        select: timerSessionSelect,
      });
    });

    return withElapsedSeconds(updated, now);
  }

  async stop(userId: string, taskId: string) {
    const now = new Date();
    const task = await this.getOwnedTask(userId, taskId);

    const session = await this.prisma.timeSession.findFirst({
      where: {
        userId,
        taskId,
        status: { in: activeSessionStatuses },
      },
      select: timerSessionSelect,
    });

    if (!session) {
      throw new BadRequestException("No active timer found for this task.");
    }

    const finalDuration =
      session.status === TimeSessionStatus.RUNNING
        ? session.durationSeconds + secondsBetween(session.startedAt, now)
        : session.durationSeconds;

    const updated = await this.prisma.$transaction(async (tx) => {
      if (task.status === TaskStatus.IN_PROGRESS || task.status === TaskStatus.PAUSED) {
        await tx.task.update({
          where: { id: taskId },
          data: { status: TaskStatus.PLANNED },
        });
      }

      return tx.timeSession.update({
        where: { id: session.id },
        data: {
          durationSeconds: finalDuration,
          endedAt: now,
          pausedAt: null,
          status: TimeSessionStatus.COMPLETED,
        },
        select: timerSessionSelect,
      });
    });

    return withElapsedSeconds(updated, now);
  }

  async getActive(userId: string) {
    const session = await this.prisma.timeSession.findFirst({
      where: {
        userId,
        status: { in: activeSessionStatuses },
      },
      select: timerSessionSelect,
      orderBy: { updatedAt: "desc" },
    });

    return {
      session: withElapsedSeconds(session),
    };
  }

  async listTaskSessions(userId: string, taskId: string) {
    await this.getOwnedTask(userId, taskId);

    return this.prisma.timeSession.findMany({
      where: { userId, taskId },
      select: timerSessionSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  private async getOwnedTask(userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
      select: { id: true, status: true },
    });

    if (!task) {
      throw new NotFoundException("Task not found.");
    }

    return task;
  }
}
