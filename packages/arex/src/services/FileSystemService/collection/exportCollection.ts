import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

export type ExportCollectionReq = {
  workspaceId: string;
  type: number;
  infoId?: string;
  nodeType?: CollectionNodeType;
};

export async function exportCollection(params: ExportCollectionReq) {
  return request
    .post<{ exportString: string }>(`/webApi/filesystem/export`, params)
    .then((res) => res.body.exportString);
}
