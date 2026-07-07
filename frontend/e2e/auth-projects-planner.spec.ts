import { expect, test } from "@playwright/test";

import { createE2ETestData } from "./helpers/test-data";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

test("registers, logs in, creates a project and completes a planner task", async ({ page }) => {
  const data = createE2ETestData();

  await page.goto("/auth/register");

  await expect(page.getByRole("heading", { name: "Start your GrowthOS workspace" })).toBeVisible();
  await page.getByLabel("Name").fill(data.userName);
  await page.getByLabel("Email").fill(data.email);
  await page.getByLabel("Password").fill(data.password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(page.getByRole("heading", { name: "Log in to GrowthOS" })).toBeVisible();

  await page.getByLabel("Email").fill(data.email);
  await page.getByLabel("Password").fill(data.password);
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/projects$/);

  await page.getByLabel("Project name").fill(data.projectName);
  await page.getByLabel("Description").fill("Created from Playwright.");
  await page.getByRole("button", { name: "Create project" }).click();

  await expect(page.getByRole("heading", { name: data.projectName })).toBeVisible();

  await page.getByRole("link", { name: "Planner" }).click();
  await expect(page).toHaveURL(/\/planner$/);

  const selectedDate = todayString();
  await page.getByLabel("Selected day").fill(selectedDate);
  await page.getByLabel("Task title").fill(data.taskTitle);
  await page.getByLabel("Project").selectOption({ label: data.projectName });
  await page.getByLabel("Estimated minutes").fill("45");
  await page.getByRole("button", { name: "Add task" }).click();

  const taskCard = page.locator("article").filter({ hasText: data.taskTitle }).first();
  await expect(taskCard).toBeVisible();
  await expect(taskCard.getByText("PLANNED", { exact: true })).toBeVisible();

  await taskCard.getByRole("button", { name: "Complete" }).click();
  await expect(taskCard.getByText("COMPLETED", { exact: true })).toBeVisible();
});

test("registers, creates a planner task, and controls the task timer", async ({ page }) => {
  const data = createE2ETestData();

  await page.goto("/auth/register");

  await page.getByLabel("Name").fill(data.userName);
  await page.getByLabel("Email").fill(data.email);
  await page.getByLabel("Password").fill(data.password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(page.getByRole("heading", { name: "Log in to GrowthOS" })).toBeVisible();

  await page.getByLabel("Email").fill(data.email);
  await page.getByLabel("Password").fill(data.password);
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.getByRole("link", { name: "Projects" }).click();
  await page.getByLabel("Project name").fill(data.projectName);
  await page.getByRole("button", { name: "Create project" }).click();
  await expect(page.getByRole("heading", { name: data.projectName })).toBeVisible();

  await page.getByRole("link", { name: "Planner" }).click();

  await page.getByLabel("Selected day").fill(todayString());
  await page.getByLabel("Task title").fill(data.taskTitle);
  await page.getByLabel("Project").selectOption({ label: data.projectName });
  await page.getByLabel("Estimated minutes").fill("25");
  await page.getByRole("button", { name: "Add task" }).click();

  const taskCard = page.locator("article").filter({ hasText: data.taskTitle }).first();
  const activeTimer = page.getByRole("region", { name: "Active timer" });

  await expect(taskCard).toBeVisible();

  await taskCard.getByRole("button", { name: "Start" }).click();
  await expect(taskCard.getByText("IN PROGRESS", { exact: true })).toBeVisible();
  await expect(activeTimer.getByText(data.taskTitle)).toBeVisible();

  await taskCard.getByRole("button", { name: "Pause" }).click();
  await expect(taskCard.getByText("PAUSED", { exact: true })).toBeVisible();
  await expect(activeTimer.getByRole("button", { name: "Resume" })).toBeVisible();

  await taskCard.getByRole("button", { name: "Resume" }).click();
  await expect(taskCard.getByText("IN PROGRESS", { exact: true })).toBeVisible();
  await expect(activeTimer.getByRole("button", { name: "Pause" })).toBeVisible();

  await taskCard.getByRole("button", { name: "Stop" }).click();
  await expect(taskCard.getByText("PLANNED", { exact: true })).toBeVisible();
  await expect(activeTimer).toBeHidden();
});
