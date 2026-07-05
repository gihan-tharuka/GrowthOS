import { TaskPriority, TaskStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsString()
  projectId!: string;

  @IsDateString()
  scheduledDate!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  estimatedMinutes!: number;

  @IsEnum(TaskPriority)
  priority!: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
