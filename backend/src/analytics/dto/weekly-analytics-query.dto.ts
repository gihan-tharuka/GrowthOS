import { IsDateString } from "class-validator";

export class WeeklyAnalyticsQueryDto {
  @IsDateString()
  from!: string;

  @IsDateString()
  to!: string;
}
