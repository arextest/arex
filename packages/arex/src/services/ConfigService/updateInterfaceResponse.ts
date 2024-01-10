import { OperationId } from '@/services/ApplicationService';
import { request } from '@/utils';

export type UpdateInterfaceResponseReq = {
  id: OperationId<'Interface'>;
  operationResponse?: string;
};

export async function updateInterfaceResponse(params: UpdateInterfaceResponseReq) {
  const res = await request.post<boolean>(
    '/webApi/config/applicationOperation/modify/UPDATE',
    params,
  );
  return res.body;
}
