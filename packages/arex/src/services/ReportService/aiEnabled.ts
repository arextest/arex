import { request } from '@/utils';

export async function aiEnabled(): Promise<boolean> {
  return (await request.get<{ aiEnabled: boolean }>('/checkFeature/webApi')).body.aiEnabled;
}
