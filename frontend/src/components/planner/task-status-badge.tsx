import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types";

const statusStyles: Record<TaskStatus, string> = {
  PLANNED: "bg-sky-100 text-sky-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  PAUSED: "bg-slate-200 text-slate-700",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-800",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[status])}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
