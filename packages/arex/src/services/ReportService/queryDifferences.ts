import { request } from '@/utils';

export type QueryDifferencesReq = {
  categoryName: string;
  operationName: string;
  planItemId: string;
};

export type Difference = {
  differenceName: string;
  sceneCount: number;
  caseCount: number;
};

export type QueryDifferencesRes = {
  differences: Difference[];
};

export async function queryDifferences(params: QueryDifferencesReq) {
  return request
    .post<QueryDifferencesRes>('/webApi/report/queryDifferences', params)
    .then((res) => Promise.resolve(res.body.differences));
}
