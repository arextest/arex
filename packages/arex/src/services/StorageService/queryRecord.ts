import { getLocalStorage } from '@arextest/arex-core';
import axios from 'axios';

import { ACCESS_TOKEN_KEY } from '@/constant';
import { ViewRecordRes } from '@/services/ReportService';
import { ResponseStatusType } from '@/utils/request';

export async function queryRecord(recordId: string) {
  const res = await axios.post<ViewRecordRes & { responseStatusType: ResponseStatusType }>(
    '/storage/storage/replay/query/viewRecord',
    {
      recordId,
      sourceProvider: 'Pinned',
    },
    {
      headers: {
        'access-token': getLocalStorage<string>(ACCESS_TOKEN_KEY),
      },
    },
  );

  return res.data.recordResult;
}
