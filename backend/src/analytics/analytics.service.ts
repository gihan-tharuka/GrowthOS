import { BadRequestException, Injectable } from "@nestjs/common";
import { ProjectStatus, TaskStatus, TimeSessionStatus } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

function toStoredDate(input: string) {
  return input.length === 10 ? new Date(`${input}T00:00:00.000Z`) : new Date(input);
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toDateRange(date: string) {
  const start = toStoredDate(date);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

function assertValidRange(from: Date, to: Date) {
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) {
    throw new BadRequestException("Invalid date range.");
  }
}

function eachDay(from: Date, to: Date) {
  const days: string[] = [];
  const cursor = new Date(from);

  while (cursor <= to) {
    days.push(toDateKey(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string) {
    const today = toDateKey(new Date());
    const { start: todayStart, end: todayEnd } = toDateRange(today);
    const weekStart = new Date(todayStart);
    weekStart.setUTCDate(weekStart.getUTCDate() - 6);

    const [todaySessions, weeklySessions, todayCompletedTasks, activeProjects, todayTasks] = await Promise.all([
      this.prisma.timeSession.findMany({
        where: {
          userId,
          status: TimeSessionStatus.COMPLETED,
          endedAt: { gte: todayStart, lt: todayEnd },
        },
        select: {
          durationSeconds: true,
          task: {
            select: {
              project: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.timeSession.findMany({
        where: {
          userId,
          status: TimeSessionStatus.COMPLETED,
          endedAt: { gte: weekStart, lt: todayEnd },
        },
        select: { durationSeconds: true },
      }),
      this.prisma.task.count({
        where: {
          userId,
          status: TaskStatus.COMPLETED,
          completedAt: { gte: todayStart, lt: todayEnd },
        },
      }),
      this.prisma.project.count({
        where: { userId, status: ProjectStatus.ACTIVE },
      }),
      this.prisma.task.findMany({
        where: {
          userId,
          scheduledDate: { gte: todayStart, lt: todayEnd },
        },
        select: {
          id: true,
          title: true,
          status: true,
          estimatedMinutes: true,
          project: {
            select: {
              id: true,
              name: true,
              color: true,
              status: true,
            },
          },
        },
        orderBy: [{ status: "asc" }, { createdAt: "asc" }],
        take: 5,
      }),
    ]);

    const projectDurations = new Map<
      string,
      { projectId: string; projectName: string; color: string | null; durationSeconds: number }
    >();

    for (const session of todaySessions) {
      const project = session.task.project;
      const current = projectDurations.get(project.id) ?? {
        projectId: project.id,
        projectName: project.name,
        color: project.color,
        durationSeconds: 0,
      };

      current.durationSeconds += session.durationSeconds;
      projectDurations.set(project.id, current);
    }

    return {
      todayFocusSeconds: todaySessions.reduce((total, session) => total + session.durationSeconds, 0),
      todayCompletedTasks,
      weeklyFocusSeconds: weeklySessions.reduce((total, session) => total + session.durationSeconds, 0),
      activeProjects,
      timeByProject: Array.from(projectDurations.values()).sort(
        (a, b) => b.durationSeconds - a.durationSeconds,
      ),
      todayTasks,
    };
  }

  async getDaily(userId: string, date: string) {
    const { start, end } = toDateRange(date);

    const [sessions, completedTasksCount, plannedTasks] = await Promise.all([
      this.prisma.timeSession.findMany({
        where: {
          userId,
          status: TimeSessionStatus.COMPLETED,
          endedAt: { gte: start, lt: end },
        },
        select: { durationSeconds: true },
      }),
      this.prisma.task.count({
        where: {
          userId,
          status: TaskStatus.COMPLETED,
          completedAt: { gte: start, lt: end },
        },
      }),
      this.prisma.task.findMany({
        where: {
          userId,
          scheduledDate: { gte: start, lt: end },
        },
        select: { estimatedMinutes: true },
      }),
    ]);

    const actualSeconds = sessions.reduce((total, session) => total + session.durationSeconds, 0);
    const estimatedMinutes = plannedTasks.reduce((total, task) => total + task.estimatedMinutes, 0);

    return {
      date: toDateKey(start),
      focusSeconds: actualSeconds,
      completedTasks: completedTasksCount,
      plannedTasks: plannedTasks.length,
      estimatedMinutes,
      actualSeconds,
      plannedVsActual: actualSeconds - estimatedMinutes * 60,
    };
  }

  async getWeekly(userId: string, from: string, to: string) {
    const fromDate = toStoredDate(from);
    const toDate = toStoredDate(to);
    assertValidRange(fromDate, toDate);

    const endExclusive = new Date(toDate);
    endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);
    const days = eachDay(fromDate, toDate);

    const [sessions, completedTasks] = await Promise.all([
      this.prisma.timeSession.findMany({
        where: {
          userId,
          status: TimeSessionStatus.COMPLETED,
          endedAt: { gte: fromDate, lt: endExclusive },
        },
        select: {
          endedAt: true,
          durationSeconds: true,
        },
      }),
      this.prisma.task.findMany({
        where: {
          userId,
          status: TaskStatus.COMPLETED,
          completedAt: { gte: fromDate, lt: endExclusive },
        },
        select: { completedAt: true },
      }),
    ]);

    const byDay = days.map((date) => ({
      date,
      focusSeconds: 0,
      completedTasks: 0,
    }));
    const dayMap = new Map(byDay.map((day) => [day.date, day]));

    for (const session of sessions) {
      if (!session.endedAt) {
        continue;
      }

      const day = dayMap.get(toDateKey(session.endedAt));
      if (day) {
        day.focusSeconds += session.durationSeconds;
      }
    }

    for (const task of completedTasks) {
      if (!task.completedAt) {
        continue;
      }

      const day = dayMap.get(toDateKey(task.completedAt));
      if (day) {
        day.completedTasks += 1;
      }
    }

    return {
      from: toDateKey(fromDate),
      to: toDateKey(toDate),
      days: byDay,
      totalFocusSeconds: byDay.reduce((total, day) => total + day.focusSeconds, 0),
      totalCompletedTasks: byDay.reduce((total, day) => total + day.completedTasks, 0),
    };
  }
}
