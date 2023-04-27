import axios from 'axios';

export type stopPlanRes = {
  result: number;
  desc: string;
};
export async function stopPlan(planId: string) {
  return new Promise<stopPlanRes>((resolve, reject) => {
    return axios
      .get('/schedule/stopPlan?planId=' + planId)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
