import { Transform } from "class-transformer";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value))
  name!: string;

  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }: { value: unknown }) => (typeof value === "string" ? value.trim().toLowerCase() : value))
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
