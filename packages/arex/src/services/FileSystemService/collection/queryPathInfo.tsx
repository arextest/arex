import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

export interface QueryPathReq {
  infoId: string;
  nodeType: CollectionNodeType;
}

export type PathInfo = {
  id: string;
  name: string;
};
export interface QueryPathRes {
  pathInfo: PathInfo[];
}

export async function queryPathInfo(params: QueryPathReq) {
  const res = await request.post<QueryPathRes>('/webApi/filesystem/getPathInfo', params);
  return res.body.pathInfo;
}
