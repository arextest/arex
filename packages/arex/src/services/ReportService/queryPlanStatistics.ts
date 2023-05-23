import { request } from '@/utils';

export type QueryPlanStatisticsReq = {
  appId?: string;
  needTotal: boolean;
  pageIndex: number;
  pageSize: number;
};

export type PlanStatistics = {
  planId: string;
  planName: string;
  status: number;
  appId: string;
  appName: string;
  creator: string;
  targetImageId: string;
  targetImageName: string;
  caseSourceType: number;
  caseEndTime?: number;
  caseStartTime?: number;
  sourceEnv: string | null;
  targetEnv: string | null;
  sourceHost: string | null;
  targetHost: string | null;
  coreVersion: string;
  extVersion: string;
  caseRecordVersion: string;
  replayStartTime: number;
  replayEndTime: number;
  recordStartTime: string | null;
  recordEndTime: string | null;
  totalCaseCount: number;
  errorCaseCount: number;
  errorMessage: string | null;
  successCaseCount: number;
  failCaseCount: number;
  waitCaseCount: number;
  totalOperationCount: number;
  errorOperationCount: number | null;
  successOperationCount: number;
  failOperationCount: number | null;
  waitOperationCount: number | null;
  totalServiceCount: number | null;
  percent?: number;
};
export type QueryPlanStatisticsRes = {
  totalCount: number;
  planStatisticList: PlanStatistics[];
};

export async function queryPlanStatistics(
  params: { current?: number; pageSize?: number } & Pick<QueryPlanStatisticsReq, 'appId'>,
) {
  const { current, pageSize, appId } = params; // current, pageSize is used for usePagination hook
  const requestParams = {
    appId,
    needTotal: true,
    pageIndex: current,
    pageSize,
  };
  return request
    .post<QueryPlanStatisticsRes>('/report/report/queryPlanStatistics', requestParams)
    .then((res) =>
      Promise.resolve({
        total: res.body.totalCount,
        list: res.body.planStatisticList.sort((a, b) => b.replayStartTime - a.replayStartTime),
      }),
    );
}
