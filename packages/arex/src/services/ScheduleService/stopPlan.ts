import { getLocalStorage } from '@arextest/arex-core';
import axios from 'axios';

import { ACCESS_TOKEN_KEY, APP_ID_KEY } from '@/constant';

export type stopPlanRes = {
  result: number;
  desc: string;
};
export async function stopPlan(planId: string) {
  return new Promise<stopPlanRes>((resolve, reject) => {
    return axios
      .get('/schedule/stopPlan?planId=' + planId, {
        headers: {
          'access-token': getLocalStorage<string>(ACCESS_TOKEN_KEY),
          appId: getLocalStorage<string>(APP_ID_KEY),
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
