import { TestDescriptor } from 'purple-js-sandbox/lib/test-runner';

import { HoppRESTRequest } from '../components/ArexRequestComponent/lib/data/rest';
import { runTestScript } from './sandbox';

function AgentAxios<T>(params: any) {
  return new Promise<T>((resolve, reject) => {
    const tid = String(Math.random());
    window.postMessage(
      {
        type: '__AREX_EXTENSION_REQUEST__',
        tid: tid,
        payload: params,
      },
      '*',
    );
    window.addEventListener('message', receiveMessage);
    function receiveMessage(ev: any) {
      if (ev.data.type === '__AREX_EXTENSION_RES__' && ev.data.tid == tid) {
        window.removeEventListener('message', receiveMessage, false);
        // 这边的err类型是真正的error，而不是401、404这种
        if (ev.data.res.type === 'error') {
          const err = new Error();
          err.message = ev.data.res.message;
          err.name = ev.data.res.name;
          err.stack = ev.data.res.stack;
          reject(err);
        } else {
          resolve(ev.data.res);
        }
      }
    }
  });
}

export default AgentAxios;

interface Test {
  request: HoppRESTRequest;
}
export const AgentAxiosAndTest = ({ request }: Test) =>
  AgentAxios({
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
  }).then((res: any) => {
    return runTestScript(request.testScript, { body: res.data, headers: [], status: 200 }).then(
      (testDescriptor) => {
        return {
          response: res,
          testResult: testDescriptor,
        };
      },
    );
  });

export const AgentAxiosCompare = ({ request }: Test) => {
  return Promise.all([
    AgentAxios({
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
    }),
    AgentAxios({
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
    }),
  ]).then((res) =>
    res.reduce((previousValue, currentValue, currentIndex) => {
      if (currentIndex === 0) {
        previousValue.response = currentValue;
      }
      if (currentIndex === 1) {
        previousValue.compareResponse = currentValue;
      }

      return previousValue;
    }, {}),
  );
};
