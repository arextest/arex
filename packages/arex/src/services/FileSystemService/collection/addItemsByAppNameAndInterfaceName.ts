import { CollectionNodeType } from '@/constant';
import request from '@/utils/request';

export interface AddItemsByAppNameAndInterfaceNameReq {
  recordId: string;
  workspaceId: string;
  operationId: string;
  // by default path
  appName?: string;
  interfaceName?: string;
  nodeName?: string;
  // manual select path
  parentInfoId?: string;
  parentNodeType?: CollectionNodeType;
}

export interface AddItemsByAppNameAndInterfaceNameRes {
  success: boolean;
  path: string[];
  workspaceId: string;
}

export async function addItemsByAppNameAndInterfaceName(
  params: AddItemsByAppNameAndInterfaceNameReq,
) {
  const res = await request.post<AddItemsByAppNameAndInterfaceNameRes>(
    '/webApi/filesystem/addItemsByAppNameAndInterfaceName',
    params,
  );

  return res.body;
}
