import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/types";

const priorityStyles: Record<TaskPriority, string> = {
  LOW: "bg-emerald-100 text-emerald-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  HIGH: "bg-rose-100 text-rose-800",
};

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", priorityStyles[priority])}>
      {priority}
    </span>
  );
}
