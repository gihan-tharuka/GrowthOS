import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "../auth/auth.types";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectsService } from "./projects.service";

@UseGuards(JwtAuthGuard)
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  list(@Request() request: AuthenticatedRequest) {
    return this.projectsService.list(request.user.userId);
  }

  @Post()
  create(@Request() request: AuthenticatedRequest, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(request.user.userId, dto);
  }

  @Get(":id")
  getById(@Request() request: AuthenticatedRequest, @Param("id") id: string) {
    return this.projectsService.getById(request.user.userId, id);
  }

  @Patch(":id")
  update(
    @Request() request: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(request.user.userId, id, dto);
  }

  @Patch(":id/archive")
  archive(@Request() request: AuthenticatedRequest, @Param("id") id: string) {
    return this.projectsService.archive(request.user.userId, id);
  }

  @Delete(":id")
  remove(@Request() request: AuthenticatedRequest, @Param("id") id: string) {
    return this.projectsService.remove(request.user.userId, id);
  }
}
