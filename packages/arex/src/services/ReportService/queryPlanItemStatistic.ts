import { request } from '@/utils';

import { PlanItemStatistics } from './queryPlanItemStatistics';

export async function queryPlanItemStatistic(planItemId: string) {
  return request
    .get<PlanItemStatistics>('/report/report/getPlanItemStatistic/' + planItemId)
    .then((res) => Promise.resolve(res.body));
}
