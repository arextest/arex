import request from '../helpers/api/axios';
import { QueryLogsReq, QueryLogsRes } from './System.type';

export class SystemService {
  static async queryLogs(params: QueryLogsReq) {
    const res = await request.post<QueryLogsRes>(`/report/logs/query`, params);
    return res.body.logs;
  }
}
