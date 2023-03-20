// @ts-nocheck
import { HoppRESTRequest } from '../../components/http/data/rest';
import AgentAxios from './AgentAxios';

export const runCompareRESTRequest = async (request: HoppRESTRequest): Promise<any> => {
  const a = await AgentAxios({
    method: request.method,
    url: request.endpoint,
    headers: request.headers.reduce((p, c) => {
      return {
        ...p,
        [c.key]: c.value,
      };
    }, {}),
    data: ['GET'].includes(request.method) ? undefined : JSON.parse(request.body.body || '{}'),
    params: ['POST'].includes(request.method)
      ? undefined
      : request.params.reduce((p, c) => {
          return {
            ...p,
            [c.key]: c.value,
          };
        }, {}),
  });
  const b = await AgentAxios({
    method: request.compareMethod,
    url: request.compareEndpoint,
    headers: request.headers.reduce((p, c) => {
      return {
        ...p,
        [c.key]: c.value,
      };
    }, {}),
    data: ['GET'].includes(request.method) ? undefined : JSON.parse(request.body.body || '{}'),
    params: ['POST'].includes(request.method)
      ? undefined
      : request.params.reduce((p, c) => {
          return {
            ...p,
            [c.key]: c.value,
          };
        }, {}),
  });
  return {
    responses: [a.data, b.data],
  };
};
