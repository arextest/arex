import { request } from '../../utils';

export interface QueryPlanItemStatisticsReq {
  planId: string;
}

export type PlanItemStatistics = {
  planItemId: string;
  planId: string;
  operationId: string;
  operationName: string;
  serviceName: string;
  appId: string;
  status: number;
  replayStartTime: number;
  replayEndTime: number;
  sourceHost: string | null;
  sourceEnv: string | null;
  targetHost: string;
  targetEnv: string | null;
  caseSourceType: number;
  caseStartTime: number;
  caseEndTime: number;
  totalCaseCount: number;
  errorCaseCount: number;
  errorMessage?: string | null;
  successCaseCount: number;
  failCaseCount: number;
  waitCaseCount: number;
  percent?: number;
};

export interface QueryPlanItemStatisticsRes {
  planItemStatisticList: PlanItemStatistics[] | null;
}

export async function queryPlanItemStatistics(params: QueryPlanItemStatisticsReq) {
  return request
    .post<QueryPlanItemStatisticsRes>('/report/report/queryPlanItemStatistics', params)
    .then((res) => Promise.resolve(res.body.planItemStatisticList));
}
