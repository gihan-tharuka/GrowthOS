import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { appConfig } from "./config/app.config";
import { HealthModule } from "./health/health.module";
import { LogsModule } from "./logs/logs.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProjectsModule } from "./projects/projects.module";
import { TasksModule } from "./tasks/tasks.module";
import { TimerModule } from "./timer/timer.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    AnalyticsModule,
    LogsModule,
    ProjectsModule,
    TasksModule,
    TimerModule,
  ],
})
export class AppModule {}
