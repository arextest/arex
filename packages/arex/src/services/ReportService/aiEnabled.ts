import { request } from '@/utils';

export type AIFeatureCheck = {
  aiEnabled: boolean;
  modelInfos: ModelInfo[];
};

export type ModelInfo = {
  modelName: string;
};

export async function aiEnabled(): Promise<AIFeatureCheck> {
  return (await request.get<AIFeatureCheck>('/checkFeature/webApi')).body;
}
