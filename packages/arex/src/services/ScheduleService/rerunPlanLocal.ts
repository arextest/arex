import { getLocalStorage } from '@arextest/arex-core';
import axios, { AxiosResponse } from 'axios';

import { ACCESS_TOKEN_KEY } from '@/constant';

import { CreatePlanRes } from './createPlan';
import { ReRunPlanReq } from './rerunPlan';

export async function rerunPlanLocal(params: ReRunPlanReq) {
  const res = await axios.post<ReRunPlanReq, AxiosResponse<CreatePlanRes>>(
    `http://localhost:${__AUTH_PORT__}/api/rerunPlan`,
    params,
    {
      headers: {
        'access-token': getLocalStorage<string>(ACCESS_TOKEN_KEY),
      },
    },
  );

  return res.data;
}
