import { request } from '@/utils';

export enum FeedbackType {
  Bug = 1,
  ByDesign = 2,
  ArexProblem = 3,
}

export interface FeedbackSceneReq {
  planId: string;
  planItemId: string;
  feedbackType: FeedbackType;
  recordId: string;
}

export async function feedbackScene(params: FeedbackSceneReq) {
  const res = await request.post<boolean>('/report/report/feedbackScene', params);
  return res.body;
}
