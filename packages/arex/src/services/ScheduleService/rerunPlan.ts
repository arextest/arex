import { getLocalStorage } from '@arextest/arex-core';
import axios from 'axios';

import { ACCESS_TOKEN_KEY, APP_ID_KEY } from '@/constant';
import { useClientStore } from '@/store';

export type ReRunPlanReq = { appId: string; planId: string; planItemId?: string };

export type ReRunPlanRes = {
  desc: string;
  result: number;
  data: { reasonCode: number; replayPlanId: string };
};

export function rerunPlan(params: ReRunPlanReq) {
  return new Promise<ReRunPlanRes>((resolve, reject) => {
    return axios
      .post<ReRunPlanRes>('/schedule/reRunPlan', params, {
        headers: {
          'access-token': getLocalStorage<string>(ACCESS_TOKEN_KEY),
          appId: getLocalStorage<string>(APP_ID_KEY),
          'arex-tenant-code': useClientStore.getState().organization,
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
