import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
      <nav className="flex items-center justify-between gap-4">
        <Link className="text-lg font-semibold tracking-normal" href="/">
          GrowthOS
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="ghost">
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>
      </nav>
      <section className="flex flex-1 flex-col justify-center py-16">
        <p className="mb-4 text-sm font-semibold uppercase tracking-normal text-primary">Phase 2 auth shell</p>
        <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-6xl">
          GrowthOS
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          A personal success operating system for planning intentional work, tracking focus, and building momentum.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/auth/register">Create account</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/login">Log in</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
