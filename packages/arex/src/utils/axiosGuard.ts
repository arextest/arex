import axios from 'axios';
import { Buffer } from 'buffer';
import xspy from 'xspy';

import { isClient, isClientProd } from '@/constant';

import proxy from '../../config/proxy.json';

// chrome插件代理
function AgentAxios<T>(params: any) {
  return new Promise<T>((resolve, reject) => {
    const tid = String(Math.random());
    window.postMessage(
      {
        type: '__AREX_EXTENSION_REQUEST__',
        tid: tid,
        payload: params,
        v: '0.3.0',
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

if (isClientProd) {
  const proxyPath = proxy.map((item) => item.path);
  axios.interceptors.request.use(
    (request) => {
      let path: string | undefined = undefined;
      if ((path = proxyPath.find((path) => request.url?.startsWith(path)))) {
        request.baseURL = proxy.find((item) => item.path === path)?.target;
        request.url = request.url?.match(new RegExp(`(?<=${path}).*`))?.[0];
      }
      return request;
    },
    (error) => {
      return Promise.reject(error.response);
    },
  );
}

if (!isClient) {
  xspy.onRequest(async (request: any, sendResponse: any) => {
    // 判断是否是pm发的
    if (request.headers['postman-token']) {
      const agentData: any = await AgentAxios({
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: ['GET'].includes(request.method) ? undefined : request.body,
      }).catch((err) => {
        console.log(err);
        return {
          status: 400,
          headers: [],
          data: '',
        };
      });
      const dummyResponse = {
        status: agentData.status,
        headers: agentData.headers.reduce((p: any, c: { key: any; value: any }) => {
          return {
            ...p,
            [c.key]: c.value,
          };
        }, {}),
        ajaxType: 'xhr',
        responseType: 'arraybuffer',
        response: new Buffer(agentData.data),
      };
      sendResponse(dummyResponse);
    } else {
      sendResponse();
    }
  });
}
