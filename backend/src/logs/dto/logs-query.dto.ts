import { IsDateString, IsOptional, IsString } from "class-validator";

export class LogsQueryDto {
  @IsDateString()
  from!: string;

  @IsDateString()
  to!: string;

  @IsOptional()
  @IsString()
  projectId?: string;
}
