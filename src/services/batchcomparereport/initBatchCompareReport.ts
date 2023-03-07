import { z } from 'zod';

import request from '../../helpers/api/axios';

export interface batchCompareCaseListItem {
  caseId: string;
  caseName: string;
  interfaceId: string;
  interfaceName: string;
}

export interface Request {
  batchCompareCaseList: Array<batchCompareCaseListItem>;
}

interface Response {
  planId: string;
}

const zResponse = z.object({
  planId: z.string(),
});

export const batchCompareReportInitBatchCompareReport = async (params: Request) => {
  const res = await request
    .post(`/report/batchcomparereport/initBatchCompareReport`, params)
    .then((res) => {
      const body = res.body as Response;
      return zResponse.parse(body);
    });
  return res;
};
