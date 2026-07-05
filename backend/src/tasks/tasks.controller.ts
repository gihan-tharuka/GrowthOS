import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";

import type { AuthenticatedRequest } from "../auth/auth.types";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TasksQueryDto } from "./dto/tasks-query.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TasksService } from "./tasks.service";

@UseGuards(JwtAuthGuard)
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  list(@Request() request: AuthenticatedRequest, @Query() query: TasksQueryDto) {
    return this.tasksService.list(request.user.userId, query);
  }

  @Post()
  create(@Request() request: AuthenticatedRequest, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(request.user.userId, dto);
  }

  @Get(":id")
  getById(@Request() request: AuthenticatedRequest, @Param("id") id: string) {
    return this.tasksService.getById(request.user.userId, id);
  }

  @Patch(":id")
  update(@Request() request: AuthenticatedRequest, @Param("id") id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(request.user.userId, id, dto);
  }

  @Patch(":id/complete")
  complete(@Request() request: AuthenticatedRequest, @Param("id") id: string) {
    return this.tasksService.complete(request.user.userId, id);
  }

  @Delete(":id")
  remove(@Request() request: AuthenticatedRequest, @Param("id") id: string) {
    return this.tasksService.remove(request.user.userId, id);
  }
}
