import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";

import type { LoginDto } from "./dto/login.dto";
import type { RegisterDto } from "./dto/register.dto";
import type { AuthResponse, JwtPayload } from "./auth.types";
import { UsersService } from "../users/users.service";

const PASSWORD_SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException("Email is already registered.");
    }

    const passwordHash = await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS);

    try {
      const user = await this.usersService.create({
        name: dto.name,
        email: dto.email,
        passwordHash,
      });

      return {
        user: this.usersService.toSafeUser(user),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException("Email is already registered.");
      }

      throw error;
    }
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: this.usersService.toSafeUser(user),
    };
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException("Invalid authentication token.");
    }

    return {
      user: this.usersService.toSafeUser(user),
    };
  }
}
