import { getLocalStorage, tryPrettierJsonString } from '@arextest/arex-core';
import axios from 'axios';

import { ACCESS_TOKEN_KEY } from '@/constant';
import { ViewRecordRes } from '@/services/ReportService';
import { ResponseStatusType } from '@/utils/request';

export async function queryRecord(recordId: string) {
  const res = await axios.post<ViewRecordRes & { responseStatusType: ResponseStatusType }>(
    '/storage/storage/replay/query/viewRecord',
    {
      recordId,
      splitMergeRecord: true,
      sourceProvider: 'Pinned',
    },
    {
      headers: {
        'access-token': getLocalStorage<string>(ACCESS_TOKEN_KEY),
      },
    },
  );

  return res.data.recordResult.map((item) => {
    item.targetRequest.body = tryPrettierJsonString(item.targetRequest.body || '');
    item.targetResponse.body = tryPrettierJsonString(item.targetResponse.body || '');
    return item;
  });
}
