import axios from 'axios';

export type ViewRecordReq = {
  recordId: string;
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

export interface TargetRequest {
  body: string;
  attributes: Attribute;
  type: string | null;
}

export interface TargetResponse {
  body: string;
  attributes?: Attribute;
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
  targetRequest: TargetRequest;
  targetResponse: TargetResponse;
  operationName: string;
  recordVersion?: number | any;
};

export interface ViewRecordRes {
  recordResult: RecordResult[];
}

export async function viewRecord(params: ViewRecordReq) {
  const res = await axios.post<ViewRecordRes>('/replay/query/viewRecord', params);
  return res.data.recordResult;
}
