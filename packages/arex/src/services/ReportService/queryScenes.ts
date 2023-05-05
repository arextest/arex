import { request } from '../../utils';

export type QueryScenesReq = {
  categoryName: string;
  differenceName: string;
  operationName: string;
  planItemId: string;
};

export type Scene = {
  compareResultId: string;
  logIndexes: string;
  sceneName: string;
};

export type QueryScenesRes = {
  scenes: Scene[];
};

export async function queryScenes(params: QueryScenesReq) {
  return request
    .post<QueryScenesRes>('/report/report/queryScenes', params)
    .then((res) => Promise.resolve(res.body.scenes));
}
