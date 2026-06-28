export type AppRoute = {
  href: string;
  label: string;
};

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: SafeUser;
};

export type UserResponse = {
  user: SafeUser;
};
