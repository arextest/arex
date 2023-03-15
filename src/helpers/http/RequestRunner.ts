import axios from 'axios';

import { HoppRESTRequest } from '../../components/http/data/rest';
import { HoppRESTResponse } from '../../components/http/helpers/types/HoppRESTResponse';
import { HoppTestResult } from '../../components/http/helpers/types/HoppTestResult';
import AgentAxios from './AgentAxios';

export const runRESTRequest = async (
  request: HoppRESTRequest,
): Promise<{
  response: HoppRESTResponse;
  testResult: HoppTestResult;
}> => {
  const response = await _runRESTRequest(request, 'EXTENSIONS_ENABLED');
  const testResult = await _runRESTRequestTest(request, response);

  return {
    response,
    testResult,
  };
};

// 预请求处理函数
export const runRESTPreRequest = async (
  request: HoppRESTRequest,
): Promise<{
  prTestResultEnvs: { key: string; value: string }[];
  prTestResultRequest: any;
}> => {
  const prTestResult = await _runRESTRequestPreTest(request);
  const prTestResultRequest: any = {};
  if (prTestResult.headers) {
    prTestResultRequest.headers = prTestResult.headers.map((h: any) => ({ ...h, active: true }));
  }
  if (prTestResult.params) {
    prTestResultRequest.params = prTestResult.params.map((p: any) => ({ ...p, active: true }));
  }
  if (prTestResult.body) {
    prTestResultRequest.body = {
      contentType: 'application/json',
      body: prTestResult.body,
    };
  }
  return {
    prTestResultEnvs: [...prTestResult.envList, ...prTestResult.varList],
    prTestResultRequest: prTestResultRequest,
  };
};

function _runRESTRequest(request: HoppRESTRequest, type: string): Promise<HoppRESTResponse> {
  if (type === 'EXTENSIONS_ENABLED') {
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
      // @ts-ignore
      data: ['GET'].includes(request.method) ? undefined : JSON.parse(request.body.body || '{}'),
      params: ['POST'].includes(request.method)
        ? undefined
        : request.params.reduce((p, c) => {
            return {
              ...p,
              [c.key]: c.value,
            };
          }, {}),
    }).then((res: any) => ({
      type: 'success',
      body: res.data,
      headers: res.headers,
      meta: {
        responseDuration: new Date().getTime() - startTime,
        responseSize: JSON.stringify(res.data).length,
      },
      statusCode: res.status,
    }));
  } else {
    return new Promise((resolve) => resolve({ type: 'loading' }));
  }
  // return {}
}

function _runRESTRequestTest(request: HoppRESTRequest, response: any): Promise<HoppTestResult> {
  const errTestResult = {
    description: '',
    expectResults: [],
    tests: [],
    envDiff: {
      global: {
        additions: [],
        deletions: [],
        updations: [],
      },
      selected: {
        additions: [],
        deletions: [],
        updations: [],
      },
    },
    scriptError: true,
  };

  return axios({
    method: 'POST',
    url: '/node/preTest',
    data: {
      response: JSON.stringify({
        headers: request.headers.reduce((p, c) => {
          return {
            ...p,
            [c.key]: c.value,
          };
        }, {}),
        body: response.body,
        status: response.statusCode,
      }),
      preTestScripts: [request.testScripts.map((t) => t.value).join('\n')],
    },
  })
    .then((testRes) => {
      try {
        return testRes.data.body.caseResult;
      } catch (e) {
        return errTestResult;
      }
    })
    .catch(() => {
      return errTestResult;
    });
}

// 从接口拿到pretest的接口数据
function _runRESTRequestPreTest(request: HoppRESTRequest) {
  return axios({
    method: 'POST',
    url: '/node/preTest',
    data: {
      body: request.body.body,
      preTestScripts: [
        (request.parentPreRequestScripts || []).map((t) => t.value).join('\n'),
        request.preRequestScripts.map((t) => t.value).join('\n'),
      ],
    },
  })
    .then((testRes) => {
      const { envList, varList, headers, params, body } = testRes.data.body;
      try {
        return {
          envList,
          varList,
          headers,
          params,
          body,
        };
      } catch (e) {
        return {
          envList: [],
          varList: [],
          headers: [],
          params: [],
          body: '',
        };
      }
    })
    .catch(() => {
      return {
        envList: [],
        varList: [],
        headers: [],
        params: [],
        body: '',
      };
    });
}
