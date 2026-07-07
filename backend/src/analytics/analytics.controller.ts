import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";

import type { AuthenticatedRequest } from "../auth/auth.types";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { AnalyticsService } from "./analytics.service";
import { DailyAnalyticsQueryDto } from "./dto/daily-analytics-query.dto";
import { WeeklyAnalyticsQueryDto } from "./dto/weekly-analytics-query.dto";

@UseGuards(JwtAuthGuard)
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("summary")
  summary(@Request() request: AuthenticatedRequest) {
    return this.analyticsService.getSummary(request.user.userId);
  }

  @Get("daily")
  daily(@Request() request: AuthenticatedRequest, @Query() query: DailyAnalyticsQueryDto) {
    return this.analyticsService.getDaily(request.user.userId, query.date);
  }

  @Get("weekly")
  weekly(@Request() request: AuthenticatedRequest, @Query() query: WeeklyAnalyticsQueryDto) {
    return this.analyticsService.getWeekly(request.user.userId, query.from, query.to);
  }
}
