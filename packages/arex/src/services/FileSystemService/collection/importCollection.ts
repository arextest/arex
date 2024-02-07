import { request } from '@/utils';

export type ImportCollectionReq = {
  workspaceId: string;
  type: number;
  path: string[];
  importString: string;
};

export async function importCollection(params: ImportCollectionReq) {
  return request.post<{ success: boolean }>(`/webApi/filesystem/import`, params).then((res) => {
    return res.body.success ? Promise.resolve() : Promise.reject();
  });
}
