"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { ActiveTimerBar } from "@/components/layout/active-timer-bar";
import { Button } from "@/components/ui/button";
import { me } from "@/lib/auth-api";
import { clearAccessToken, getAccessToken } from "@/lib/auth-token";
import type { AppRoute, SafeUser } from "@/types";
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
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const token = getAccessToken();

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    me(token)
      .then((response) => {
        if (isMounted) {
          setUser(response.user);
        }
      })
      .catch(() => {
        clearAccessToken();
        router.replace("/auth/login");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  function handleLogout() {
    clearAccessToken();
    router.replace("/auth/login");
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">Loading GrowthOS...</p>
      </main>
    );
  }

  if (!user) {
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
