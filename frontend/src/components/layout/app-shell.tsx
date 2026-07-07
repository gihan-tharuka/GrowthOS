"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { ActiveTimerBar } from "@/components/layout/active-timer-bar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useTimerStore } from "@/stores/timer-store";
import type { AppRoute } from "@/types";
import { cn } from "@/lib/utils";

const routes: AppRoute[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/planner", label: "Planner" },
  { href: "/projects", label: "Projects" },
  { href: "/logs", label: "Logs" },
  { href: "/settings", label: "Settings" },
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
  const logout = useAuthStore((state) => state.logout);
  const clearTimer = useTimerStore((state) => state.clearTimer);

  useEffect(() => {
    void hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  function handleLogout() {
    logout();
    clearTimer();
    router.replace("/auth/login");
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">Loading GrowthOS...</p>
      </main>
    );
  }

  if (!user || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <nav className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link className="text-lg font-semibold tracking-normal" href="/dashboard">
            GrowthOS
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {routes.map((route) => (
              <Link
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === route.href && "bg-accent text-accent-foreground",
                )}
                href={route.href}
                key={route.href}
              >
                {route.label}
              </Link>
            ))}
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden min-w-0 text-right sm:block">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button onClick={handleLogout} size="sm" type="button" variant="outline">
              Logout
            </Button>
          </div>
        </nav>
      </header>
      <ActiveTimerBar />
      {children}
    </div>
  );
}
