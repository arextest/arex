import { LogLevel } from '../pages/Logs';

export interface QueryLogsReq {
  pageSize?: number;
  level?: (typeof LogLevel)[number];
  previousId?: string;
  tags?: Record<string, string>;
}

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
