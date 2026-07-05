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
  await expect(taskCard.getByText("PLANNED")).toBeVisible();

  await taskCard.getByRole("button", { name: "Complete" }).click();
  await expect(taskCard.getByText("COMPLETED")).toBeVisible();
});
