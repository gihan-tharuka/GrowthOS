"use client";

type DateSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DateSelector({ value, onChange }: DateSelectorProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <label className="text-sm font-medium text-foreground" htmlFor="planner-date">
        Selected day
      </label>
      <input
        className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
        id="planner-date"
        onChange={(event) => onChange(event.target.value)}
        type="date"
        value={value}
      />
    </div>
  );
}
