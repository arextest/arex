import axios, { AxiosResponse } from 'axios';

import { CreatePlanReq, CreatePlanRes } from '@/services/ScheduleService/createPlan';

export async function createPlanLocal(params: CreatePlanReq) {
  const res = await axios.post<CreatePlanReq, AxiosResponse<CreatePlanRes>>(
    `http://localhost:${__AUTH_PORT__}/api/createPlan`,
    params,
  );

  return res.data;
}
