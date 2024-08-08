import { getLocalStorage } from '@arextest/arex-core';
import axios from 'axios';

import { ACCESS_TOKEN_KEY, APP_ID_KEY } from '@/constant';

export type StopPlanReq = {
  planId: string;
  operator?: string;
};

export type StopPlanRes = {
  result: number;
  desc: string;
};

export async function stopPlan(params: StopPlanReq) {
  return new Promise<StopPlanRes>((resolve, reject) => {
    return axios
      .get(`/schedule/stopPlan?planId=${params.planId}&operator=${params.operator}`, {
        headers: {
          'access-token': getLocalStorage<string>(ACCESS_TOKEN_KEY),
          appId: getLocalStorage<string>(APP_ID_KEY),
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
