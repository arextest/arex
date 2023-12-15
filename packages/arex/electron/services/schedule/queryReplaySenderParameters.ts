import { AxiosResponse } from 'axios';

import { zstdDecompress } from '../../helper';
import { ScheduleAxios } from './index';

export interface QueryReplaySenderParametersReq {
  caseIds: string[];
  planId: string;
  replayPlanType: number; // TODO enum
}

export type ReplaySenderParameters = {
  appId: string;
  url: string;
  operation: string;
  message: string; // post request data
  subEnv: string;
  headers: Record<string, string>;
  recordId: string;
  method: string;
};

export interface QueryReplaySenderParametersRes {
  result: number;
  desc: string;
  data: {
    replaySenderParametersMap: Record<string, string>;
  };
}
// 异步处理每个键值对
async function convertData<T>(data: Record<string, string>): Promise<Record<string, T>> {
  const result = {};
  for (const [key, compressedString] of Object.entries(data)) {
    // logger.log([key, compressedString]);
    const decompressedString = await zstdDecompress(compressedString);
    // logger.log(decompressedString);
    result[key] = JSON.parse(decompressedString);
  }

  return result;
}

export default async function queryReplaySenderParameters(params: QueryReplaySenderParametersReq) {
  const res = await ScheduleAxios.post<
    QueryReplaySenderParametersReq,
    AxiosResponse<QueryReplaySenderParametersRes>
  >('/api/replay/local/queryReplaySenderParameters', params);
  const parametersMap = res.data.data.replaySenderParametersMap;
  return await convertData<ReplaySenderParameters>(parametersMap);
}
