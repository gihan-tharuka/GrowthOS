import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

export type SafeUser = Omit<User, "passwordHash">;

type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  create(input: CreateUserInput) {
    return this.prisma.user.create({
      data: input,
    });
  }

  toSafeUser(user: User): SafeUser {
    const { passwordHash: _passwordHash, ...safeUser } = user;

    return safeUser;
  }
}
