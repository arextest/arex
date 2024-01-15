import { request } from '@/utils';

export interface QueryAllDiffMsgReq {
  recordId: string;
  planItemId: string;
  diffResultCodeList: number[]; // 0-正常，1,2-异常
  pageIndex: number;
  pageSize: number;
  needTotal: boolean;
}

export interface NodePath {
  nodeName: string;
  index: number;
}

export type DiffLog = {
  nodePath: NodePath[];
  logIndex: number;
};

export type CompareResultDetail = {
  id: string;
  categoryName: string;
  operationName: string;
  diffResultCode: number;
  logInfos: DiffLog[] | null;
  exceptionMsg: string | null;
  baseMsg: string;
  testMsg: string;
};

export interface QueryAllDiffMsgRes {
  compareResultDetailList: CompareResultDetail[];
  totalCount: number;
}
export async function queryAllDiffMsg(params: QueryAllDiffMsgReq) {
  return request
    .post<QueryAllDiffMsgRes>('/webApi/report/queryAllDiffMsg', params)
    .then((res) => Promise.resolve(res.body));
}
