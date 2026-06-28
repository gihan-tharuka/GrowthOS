import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
      <Link className="text-lg font-semibold tracking-normal" href="/">
        GrowthOS
      </Link>
      <section className="flex flex-1 flex-col justify-center py-12">
        <div className="mb-8 max-w-md">
          <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-primary">Welcome back</p>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground">Log in to GrowthOS</h1>
          <p className="mt-3 text-muted-foreground">Use your account to access the protected app pages.</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
