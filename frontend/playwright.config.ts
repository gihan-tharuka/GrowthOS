import { defineConfig, devices } from "@playwright/test";

const slowMo = Number(process.env.PLAYWRIGHT_SLOW_MO ?? 0);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    launchOptions: {
      slowMo: Number.isFinite(slowMo) ? slowMo : 0,
    },
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: [
    {
      command: '/bin/zsh -lc "cd ../backend && npm run start"',
      url: "http://localhost:4000/health",
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: '/bin/zsh -lc "NEXT_PUBLIC_API_URL=http://localhost:4000 npm run dev"',
      url: "http://localhost:3000",
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
