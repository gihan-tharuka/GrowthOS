import type { AnalyticsSummary, DailyAnalytics, WeeklyAnalytics } from "@/types";

import { authenticatedApiRequest } from "./api";

export function getAnalyticsSummary() {
  return authenticatedApiRequest<AnalyticsSummary>("/analytics/summary");
}

export function getDailyAnalytics(date: string) {
  return authenticatedApiRequest<DailyAnalytics>(`/analytics/daily?date=${encodeURIComponent(date)}`);
}

export function getWeeklyAnalytics(from: string, to: string) {
  const params = new URLSearchParams({ from, to });
  return authenticatedApiRequest<WeeklyAnalytics>(`/analytics/weekly?${params.toString()}`);
}
