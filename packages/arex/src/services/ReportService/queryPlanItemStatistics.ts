import { request } from '@/utils';

export interface QueryPlanItemStatisticsReq {
  planId: string;
}

export type PlanItemStatistic = {
  planItemId: string;
  planId: string;
  operationId: string;
  operationName: string | null;
  serviceName: string;
  appId: string;
  appName: string;
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
  planItemStatisticList: PlanItemStatistic[] | null;
}

export async function queryPlanItemStatistics(params: QueryPlanItemStatisticsReq) {
  return request
    .post<QueryPlanItemStatisticsRes>('/report/report/queryPlanItemStatistics', params)
    .then((res) => Promise.resolve(res.body.planItemStatisticList));
}
