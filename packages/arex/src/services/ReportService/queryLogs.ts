import { LogLevel } from '@/pages/Logs';
import { request } from '@/utils';

export type StackTrace = {
  className: string;
  methodName: string;
  fileName: string;
  lineNumber: number;
};

export type Log = {
  id: string;
  level: (typeof LogLevel)[number];
  loggerName: string;
  message: string;
  threadId: number;
  threadName: string;
  threadPriority: number;
  millis: number;
  contextMap: Record<string, string>;
  source: StackTrace;
  thrown: {
    type: string;
    message: string | null;
    stackTrace: StackTrace[];
  } | null;
};

export interface QueryLogsRes {
  logs: Log[];
}

export async function queryLogs(params: {
  previousId: string | undefined;
  level: string;
  pageSize: number;
  tags: { 'app-type'?: string };
  startTime?: number;
  endTime?: number;
}) {
  const res = await request.post<QueryLogsRes>(`/webApi/logs/query`, params);
  return res.body.logs;
}
