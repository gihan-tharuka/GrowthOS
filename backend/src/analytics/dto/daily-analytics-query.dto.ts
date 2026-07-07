import { IsDateString } from "class-validator";

export class DailyAnalyticsQueryDto {
  @IsDateString()
  date!: string;
}
