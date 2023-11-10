import axios from 'axios';

import { InterfaceNoiseItem } from '@/services/ScheduleService/queryNoise';

interface ExcludeNoiseReq {
  appId: string;
  planId: string;
  interfaceNoiseItemList: InterfaceNoiseItem[];
}

export async function excludeNoise(params: ExcludeNoiseReq) {
  const res = await axios.post<ExcludeNoiseReq, { data: { data: boolean } }>(
    '/schedule/excludeNoise',
    params,
  );
  return res.data.data;
}
