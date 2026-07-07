"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { login } from "@/lib/auth-api";
import { useAuthStore } from "@/stores/auth-store";

function validateForm(email: string, password: string) {
  if (!email.includes("@")) {
    return "Enter a valid email address.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return null;
}

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm(email, password);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      setAuth(response.accessToken, response.user);
      router.push("/dashboard");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to log in.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="w-full max-w-md space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-medium text-foreground" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground" htmlFor="password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
          id="password"
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <Button className="w-full" disabled={isLoading} type="submit">
        {isLoading ? "Logging in..." : "Log in"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Need an account?{" "}
        <Link className="font-medium text-primary hover:underline" href="/auth/register">
          Register
        </Link>
      </p>
    </form>
  );
}
