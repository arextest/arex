import { OperationId, OperationInterface } from '@/services/ApplicationService';
import { request } from '@/utils';

export async function queryInterfaceResponse(params: { id: OperationId<'Interface'> }) {
  const res = await request.get<OperationInterface>(
    '/report/config/applicationOperation/useResult/operationId/' + params.id,
  );
  return res.body;
}
