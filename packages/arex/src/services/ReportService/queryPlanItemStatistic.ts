import { request } from '@/utils';

import { PlanItemStatistic } from './queryPlanItemStatistics';

export async function queryPlanItemStatistic(planItemId: string) {
  return request
    .get<PlanItemStatistic>('/webApi/report/getPlanItemStatistic/' + planItemId)
    .then((res) => Promise.resolve(res.body));
}
