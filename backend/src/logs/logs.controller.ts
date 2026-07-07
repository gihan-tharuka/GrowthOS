import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";

import type { AuthenticatedRequest } from "../auth/auth.types";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { LogsQueryDto } from "./dto/logs-query.dto";
import { LogsService } from "./logs.service";

@UseGuards(JwtAuthGuard)
@Controller("logs")
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  list(@Request() request: AuthenticatedRequest, @Query() query: LogsQueryDto) {
    return this.logsService.list(request.user.userId, query);
  }
}
