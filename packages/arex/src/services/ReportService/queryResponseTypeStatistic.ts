import { request } from '@/utils';

export interface QueryResponseTypeStatisticReq {
  planItemId: string;
}
export type CategoryStatistic = {
  categoryName: string;
  errorCaseCount: number;
  failCaseCount: number;
  operationName: string;
  successCaseCount: number;
  totalCaseCount: number;
};
export interface QueryResponseTypeStatisticRes {
  categoryStatisticList: CategoryStatistic[];
}

export async function queryResponseTypeStatistic(params: QueryResponseTypeStatisticReq) {
  return request
    .post<QueryResponseTypeStatisticRes>('/webApi/report/queryResponseTypeStatistic', params)
    .then((res) => Promise.resolve(res.body.categoryStatisticList || []));
}
