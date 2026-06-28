import Link from "next/link";

import type { AppRoute } from "@/types";

const routes: AppRoute[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/planner", label: "Planner" },
  { href: "/projects", label: "Projects" },
  { href: "/logs", label: "Logs" },
  { href: "/settings", label: "Settings" },
];

export function SiteNav() {
  return (
    <header className="border-b border-border bg-background">
      <nav className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link className="text-lg font-semibold tracking-normal" href="/">
          GrowthOS
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {routes.map((route) => (
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              href={route.href}
              key={route.href}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
