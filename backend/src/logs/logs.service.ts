import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, TimeSessionStatus } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { LogsQueryDto } from "./dto/logs-query.dto";

function toStoredDate(input: string) {
  return input.length === 10 ? new Date(`${input}T00:00:00.000Z`) : new Date(input);
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, query: LogsQueryDto) {
    const from = toStoredDate(query.from);
    const to = toStoredDate(query.to);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) {
      throw new BadRequestException("Invalid date range.");
    }

    if (query.projectId) {
      const project = await this.prisma.project.findFirst({
        where: { id: query.projectId, userId },
        select: { id: true },
      });

      if (!project) {
        throw new NotFoundException("Project not found.");
      }
    }

    const endExclusive = new Date(to);
    endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);

    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        ...(query.projectId ? { projectId: query.projectId } : {}),
        OR: [
          { scheduledDate: { gte: from, lt: endExclusive } },
          { completedAt: { gte: from, lt: endExclusive } },
          {
            timeSessions: {
              some: {
                status: TimeSessionStatus.COMPLETED,
                endedAt: { gte: from, lt: endExclusive },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        scheduledDate: true,
        estimatedMinutes: true,
        status: true,
        completedAt: true,
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        timeSessions: {
          where: {
            status: TimeSessionStatus.COMPLETED,
            endedAt: { gte: from, lt: endExclusive },
          },
          select: {
            durationSeconds: true,
            endedAt: true,
          },
        },
      },
      orderBy: [{ scheduledDate: "desc" }, { createdAt: "desc" }],
    });

    return tasks.map((task) => {
      const actualSeconds = task.timeSessions.reduce((total, session) => total + session.durationSeconds, 0);
      const latestSessionDate = task.timeSessions
        .map((session) => session.endedAt)
        .filter((date): date is Date => Boolean(date))
        .sort((a, b) => b.getTime() - a.getTime())[0];

      return {
        date: toDateKey(latestSessionDate ?? task.completedAt ?? task.scheduledDate),
        taskId: task.id,
        taskTitle: task.title,
        projectId: task.project.id,
        projectName: task.project.name,
        projectColor: task.project.color,
        estimatedMinutes: task.estimatedMinutes,
        actualSeconds,
        status: task.status,
        completedAt: task.completedAt,
      };
    });
  }
}
