import type { SafeUser } from "../users/users.service";

export type JwtPayload = {
  sub: string;
  email: string;
};

export type JwtRequestUser = {
  userId: string;
  email: string;
};

export type AuthenticatedRequest = {
  user: JwtRequestUser;
};

export type AuthResponse = {
  accessToken: string;
  user: SafeUser;
};
