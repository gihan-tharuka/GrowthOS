export type E2ETestData = {
  userName: string;
  email: string;
  password: string;
  projectName: string;
  taskTitle: string;
};

export function createE2ETestData(): E2ETestData {
  const token = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    userName: `Playwright User ${token}`,
    email: `playwright-${token}@example.com`,
    password: `Password!${token}`,
    projectName: `PW Project ${token}`,
    taskTitle: `PW Task ${token}`,
  };
}
