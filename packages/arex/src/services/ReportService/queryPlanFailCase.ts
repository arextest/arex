import { PlanItemStatistic } from '@/services/ReportService/queryPlanItemStatistics';
import { request } from '@/utils';

export type QueryPlanFailCaseReq = {
  planId: string;
  planItemIdList?: string[];
  recordIdList?: string[];
  diffResultCodeList: number[];
};

export type failCaseInfo = {
  operationId: string;
  replayIdList: string[];
};

export type QueryPlanFailCaseRes = {
  failCaseInfoList: failCaseInfo[];
};

export async function queryPlanFailCase(
  params: Omit<QueryPlanFailCaseReq, 'diffResultCodeList'>,
  operationName?: PlanItemStatistic['operationName'],
) {
  return request
    .post<QueryPlanFailCaseRes>('/webApi/report/queryPlanFailCase', {
      ...params,
      diffResultCodeList: [1, 2],
    })
    .then((res) => Promise.resolve(res.body.failCaseInfoList));
}
