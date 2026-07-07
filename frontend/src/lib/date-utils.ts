export function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function todayString() {
  return toDateInputValue(new Date());
}

export function daysAgoString(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return toDateInputValue(date);
}

export function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00.000Z`));
}
