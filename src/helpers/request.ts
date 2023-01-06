// @ts-nocheck
import axios from 'axios';

import { HoppRESTRequest } from '../components/arex-request/data/rest';
import { HoppRESTResponse } from '../components/arex-request/helpers/types/HoppRESTResponse';
import { HoppTestResult } from '../components/arex-request/helpers/types/HoppTestResult';
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

export const AgentAxiosAndTest = ({
  request,
}: {
  request: HoppRESTRequest;
}): Promise<{ response: HoppRESTResponse; testResult: HoppTestResult }> => {
  const startTime = new Date().getTime();
  return AgentAxios({
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
    return axios({
      method: 'POST',
      url: 'http://10.5.153.1:10001/preTest',
      data: {
        response: '{"appId": "arex.1.20220909A"}',
        preTestScripts: [request.testScript],
      },
    }).then((testRes) => {
      console.log(testRes.data.body.caseResult, 'testRes.data.body.caseResult');
      return {
        testResult: testRes.data.body.caseResult,
        response: {
          ...res,
          type: 'success',
          body: res.data,
          headers: res.headers,
          meta: {
            responseDuration: new Date().getTime() - startTime,
            responseSize: JSON.stringify(res.data).length,
          },
          statusCode: res.status,
        },
      };
    });
  });
};

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
