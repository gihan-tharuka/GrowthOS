import type { AuthResponse, UserResponse } from "@/types";

import { apiRequest } from "./api";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export function register(input: RegisterInput) {
  return apiRequest<UserResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function login(input: LoginInput) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function me(token: string) {
  return apiRequest<UserResponse>("/auth/me", {
    method: "GET",
    token,
  });
}
