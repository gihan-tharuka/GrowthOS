import { Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";

import type { AuthenticatedRequest } from "../auth/auth.types";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { TimerService } from "./timer.service";

@UseGuards(JwtAuthGuard)
@Controller()
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Post("tasks/:taskId/timer/start")
  start(@Request() request: AuthenticatedRequest, @Param("taskId") taskId: string) {
    return this.timerService.start(request.user.userId, taskId);
  }

  @Post("tasks/:taskId/timer/pause")
  pause(@Request() request: AuthenticatedRequest, @Param("taskId") taskId: string) {
    return this.timerService.pause(request.user.userId, taskId);
  }

  @Post("tasks/:taskId/timer/resume")
  resume(@Request() request: AuthenticatedRequest, @Param("taskId") taskId: string) {
    return this.timerService.resume(request.user.userId, taskId);
  }

  @Post("tasks/:taskId/timer/stop")
  stop(@Request() request: AuthenticatedRequest, @Param("taskId") taskId: string) {
    return this.timerService.stop(request.user.userId, taskId);
  }

  @Get("timer/active")
  getActive(@Request() request: AuthenticatedRequest) {
    return this.timerService.getActive(request.user.userId);
  }

  @Get("tasks/:taskId/sessions")
  listTaskSessions(@Request() request: AuthenticatedRequest, @Param("taskId") taskId: string) {
    return this.timerService.listTaskSessions(request.user.userId, taskId);
  }
}
