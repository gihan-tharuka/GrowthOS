import type { LogRow } from "@/types";

import { authenticatedApiRequest } from "./api";

type ListLogsParams = {
  from: string;
  to: string;
  projectId?: string;
};

export function listLogs(params: ListLogsParams) {
  const searchParams = new URLSearchParams({
    from: params.from,
    to: params.to,
  });

  if (params.projectId) {
    searchParams.set("projectId", params.projectId);
  }

  return authenticatedApiRequest<LogRow[]>(`/logs?${searchParams.toString()}`);
}
