import axios from 'axios';

export type ReRunPlanRes = {
  desc: string;
  result: number;
  data: { reasonCode: number; replayPlanId: string };
};

export function reRunPlan(params: { planId: string }) {
  return new Promise<ReRunPlanRes>((resolve, reject) => {
    return axios
      .post<ReRunPlanRes>('/schedule/reRunPlan', params)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
