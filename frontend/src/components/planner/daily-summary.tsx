type DailySummaryProps = {
  totalTasks: number;
  completedTasks: number;
  totalEstimatedMinutes: number;
};

export function DailySummary({ totalTasks, completedTasks, totalEstimatedMinutes }: DailySummaryProps) {
  const cards = [
    { label: "Total tasks", value: totalTasks },
    { label: "Completed", value: completedTasks },
    { label: "Planned minutes", value: totalEstimatedMinutes },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div className="rounded-lg border border-border bg-card p-4" key={card.label}>
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{card.value}</p>
        </div>
      ))}
    </section>
  );
}
