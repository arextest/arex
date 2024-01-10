import { OperationId, OperationInterface } from '@/services/ApplicationService';
import { request } from '@/utils';

export async function queryInterfaceResponse(params: { appId: OperationId<'Interface'> }) {
  const res = await request.get<OperationInterface>(
    '/webApi/config/applicationOperation/useResult/operationId/' + params.appId,
  );
  return res.body;
}
