import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const forwardedArgs = [];
let slowMoValue = null;

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];

  if (arg.startsWith("--slow-mo=")) {
    slowMoValue = arg.slice("--slow-mo=".length);
    continue;
  }

  if (arg === "--slow-mo") {
    slowMoValue = args[index + 1] ?? null;
    index += 1;
    continue;
  }

  forwardedArgs.push(arg);
}

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["playwright", "test", "--project=chromium", "--headed", ...forwardedArgs],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      ...(slowMoValue ? { PLAYWRIGHT_SLOW_MO: slowMoValue } : {}),
    },
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
