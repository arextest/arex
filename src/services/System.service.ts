import request from '../helpers/api/axios';
import { QueryLogsReq, QueryLogsRes } from './System.type';

export class SystemService {
  static async queryLogs(params: {
    previousId: string | undefined;
    level: string;
    pageSize: number;
    tags: { 'app-type'?: string };
    startTime?: number;
    endTime?: number;
  }) {
    const res = await request.post<QueryLogsRes>(`/report/logs/query`, params);
    return res.body.logs;
  }
}
