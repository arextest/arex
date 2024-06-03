import { getLocalStorage } from '@arextest/arex-core';
import axios, { AxiosResponse } from 'axios';

import { ACCESS_TOKEN_KEY } from '@/constant';
import { CreatePlanReq, CreatePlanRes } from '@/services/ScheduleService/createPlan';

export async function createPlanLocal(params: CreatePlanReq) {
  const res = await axios.post<CreatePlanReq, AxiosResponse<CreatePlanRes>>(
    `http://localhost:${__AUTH_PORT__}/api/createPlan`,
    params,
    {
      headers: {
        'access-token': getLocalStorage<string>(ACCESS_TOKEN_KEY),
      },
    },
  );

  return res.data;
}
