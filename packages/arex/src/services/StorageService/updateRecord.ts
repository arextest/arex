import request from '../../utils/request';
import { RecordResult } from '../ReportService';

export async function updateRecord(params: RecordResult): Promise<boolean> {
  const res = await request.post<{ responseStatusType: ResponseStatusType }>(
    '/storage/storage/edit/pinned/update/',
    params,
  );
  return res.responseStatusType.responseCode === 0;
}
