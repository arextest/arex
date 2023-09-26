import sdk from 'postman-collection';

import {
  ArexEnvironment,
  ArexRESTParam,
  ArexRESTRequest,
  ArexRESTResponse,
  ArexTestResult,
  ArexVisualizer,
} from '../../types';
import { convertToPmBody } from './convertToPmBody';

const convertToUrl = (requestParams: ArexRESTParam[]) => {
  const params: string[] = [];
  requestParams.forEach(({ key, value }) => {
    const param = key + '=' + value;
    params.push(param);
  });
  return '?' + params.join('&');
};

// 发送一个request
export async function sendRequest(
  request: ArexRESTRequest,
  environment?: ArexEnvironment,
): Promise<{
  response: ArexRESTResponse;
  testResult: ArexTestResult[];
  consoles: any[];
  visualizer: ArexVisualizer;
}> {
  // @ts-ignore
  const runner = new window.PostmanRuntime.Runner();
  // arex数据接口转postman数据结构
  const rawCollection = {
    info: {
      _postman_id: '7b650e98-a5d2-4925-b23c-a4fb33a14832',
      name: 'test',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      _exporter_id: '14623557',
    },
    item: [
      {
        name: request.name,
        event: [
          {
            listen: 'prerequest',
            script: {
              exec: [request.preRequestScript],
              type: 'text/javascript',
            },
          },
          {
            listen: 'test',
            script: {
              exec: [request.testScript],
              type: 'text/javascript',
            },
          },
        ],
        request: {
          method: request.method,
          header: request.headers.filter((i) => i.active),
          body: convertToPmBody(request.body),
          url: sdk.Url.parse(
            request.endpoint + convertToUrl(request.params.filter((i) => i.active)),
          ),
        },
        response: [],
      },
    ],
  };

  const collection = new sdk.Collection(rawCollection);
  let assertionsBox: any = [];
  const consolesBox: any = [];
  let res: any = {};
  return new Promise((resolve, reject) => {
    runner.run(
      collection,
      {
        environment: new sdk.VariableScope({
          name: environment?.name,
          values: environment?.variables,
        }),
        fileResolver: {
          stat(src: any, cb: any) {
            cb(null, {
              isFile: function () {
                return true;
              },
              mode: 33188, //权限
            });
          },
          createReadStream(base64: string) {
            return base64;
          },
        },
      },
      function (err: any, run: any) {
        run.start({
          assertion: function (cursor: any, assertions: any) {
            assertionsBox = [...assertionsBox, ...assertions];
          },
          console: function (cursor: any, level: any, ...logs: any) {
            consolesBox.push(logs);
          },
          prerequest: function (err: any, cursor: any, results: any, item: any) {
            // console.log('');
          },
          responseData: function (cursor: any, data: any) {
            // console.log('');
          },
          test: function (err: any, cursor: any, results: any, item: any) {
            // results: Array of objects. Each object looks like this:
            //  {
            //      error: Error,
            //      event: sdk.Event,
            //      script: sdk.Script,
            //      result: {
            //          target: 'test'
            //
            //          -- Updated environment
            //          environment: <VariableScope>
            //
            //          -- Updated globals
            //          globals: <VariableScope>
            //
            //          response: <sdk.Response>
            //          request: <sdk.Request>
            //          types: <Object of types variables>
            //          cookies: <Array of "sdk.Cookie" objects>
            //          tests: <Object>
            //          return: <Object, contains set next request params, etc>
            //      }
            //  }
          },
          item: function (err: any, cursor: any, item: any, visualizer: any) {
            resolve({
              response: res,
              testResult: assertionsBox,
              consoles: consolesBox,
              visualizer: visualizer,
            });
          },
          //调用一次，并对集合中的每个请求进行响应
          response: function (
            err: any,
            cursor: any,
            response: any,
            request: any,
            item: any,
            cookies: any,
            history: any,
          ) {
            res = {
              type: 'success',
              headers: response.headers.members,
              statusCode: response.code,
              body: response.stream,
              meta: {
                responseSize: response.stream.length, // in bytes
                responseDuration: response.responseTime, // in millis
              },
            };
          },
        });
      },
    );
  });
}