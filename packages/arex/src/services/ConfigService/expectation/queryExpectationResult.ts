import { request } from '@/utils';

export type ExpectationResult = {
  caseId: string;
  category: string;
  operation: string;
  path: string;
  message: string;
  result: boolean;
  assertionText: string;
  dataChangeCreateTime: number;
};

export async function queryExpectationResult(caseId: string) {
  const res = await request.get<ExpectationResult[]>(
    '/schedule/report/expectation/result/' + caseId,
  );
  return res.body;
}
