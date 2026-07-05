import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, ProjectStatus } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

const projectSummarySelect = {
  id: true,
  userId: true,
  name: true,
  description: true,
  color: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      tasks: true,
    },
  },
} satisfies Prisma.ProjectSelect;

export type ProjectSummary = Prisma.ProjectGetPayload<{
  select: typeof projectSummarySelect;
}>;

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      select: projectSummarySelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(userId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
      select: projectSummarySelect,
    });

    if (!project) {
      throw new NotFoundException("Project not found.");
    }

    return project;
  }

  create(userId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        userId,
        name: dto.name,
        description: dto.description || null,
        color: dto.color || null,
      },
      select: projectSummarySelect,
    });
  }

  async update(userId: string, id: string, dto: UpdateProjectDto) {
    await this.ensureOwnedProject(userId, id);

    return this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description || null } : {}),
        ...(dto.color !== undefined ? { color: dto.color || null } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      },
      select: projectSummarySelect,
    });
  }

  async archive(userId: string, id: string) {
    await this.ensureOwnedProject(userId, id);

    return this.prisma.project.update({
      where: { id },
      data: { status: ProjectStatus.ARCHIVED },
      select: projectSummarySelect,
    });
  }

  async remove(userId: string, id: string) {
    await this.ensureOwnedProject(userId, id);
    await this.prisma.project.delete({
      where: { id },
    });

    return {
      success: true,
    };
  }

  async ensureOwnedProject(userId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException("Project not found.");
    }

    return project;
  }
}
