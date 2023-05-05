import { request } from '../../utils';

export interface QuerySceneInfoReq {
  planId: string;
  planItemId: string;
}

export interface Detail {
  code: number;
  categoryName: string;
  operationName: string;
}

export interface SubScene {
  count: number;
  recordId: string;
  replayId: string;
  details: Detail[];
}

export interface SceneInfo {
  count: number;
  subScenes: SubScene[]; // could be null;
}

export interface QuerySceneInfoRes {
  sceneInfos: SceneInfo[];
}

export async function querySceneInfo(params: QuerySceneInfoReq) {
  return request
    .get<QuerySceneInfoRes>(`/report/report/querySceneInfo/${params.planId}/${params.planItemId}`)
    .then((res) => Promise.resolve(res.body.sceneInfos.filter((scene) => scene.subScenes))); //  subScenes could be null;
}
