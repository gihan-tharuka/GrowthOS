import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-65px)] w-full max-w-6xl flex-col justify-center px-6 py-16">
      <section className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-normal text-primary">Phase 1 foundation</p>
        <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-6xl">
          GrowthOS
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          A personal success operating system for planning intentional work, tracking focus, and building momentum.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/planner">View planner</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
