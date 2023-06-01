import axios from 'axios';

export type ViewRecordReq = {
  recordId: string;
  sourceProvider?: string;
};
export interface CategoryType {
  name: string;
  entryPoint: boolean;
  skipComparison: boolean;
}

export interface Attribute {
  requestPath: string;
  catId: string;
  format: string;
  headers: Record<string, string>;
  cookies: Record<string, string>;
  configBatchNo: string;
}

export interface MockTarget {
  body: string;
  attributes: Attribute;
  bodyParsed?: Record<string, any> | null; // 非接口字段，数据转换用
  type: string | null;
}

export type RecordResult = {
  id: string;
  categoryType: CategoryType;
  replayId: string | any;
  recordId: string;
  appId: string;
  recordEnvironment: number;
  creationTime: number;
  targetRequest: MockTarget;
  targetResponse: MockTarget;
  targetRequestString?: string; // 非接口字段，数据转换用
  targetResponseString?: string; // 非接口字段，数据转换用
  operationName: string;
  recordVersion?: number | any;
};

export interface ViewRecordRes {
  recordResult: RecordResult[];
}

export async function viewRecord(params: ViewRecordReq) {
  const res = await axios.post<ViewRecordRes>('/storage/storage/replay/query/viewRecord', params);
  return res.data.recordResult;
}
