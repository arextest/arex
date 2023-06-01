import { RecordResult } from '@/services/StorageService/viewRecord';
import { request } from '@/utils';

export async function updateMockData(params: RecordResult) {
  const res = await request.post<{ success: boolean }>(
    '/storage/storage/edit/pinned/update/',
    params,
  );
  return res.body.success;
}
