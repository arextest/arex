// @ts-ignore
import sdk from 'postman-collection';

import { convertToPmBody } from './convertToPmBody';
const converToUrl = (requestParams: any) => {
  const params: any = [];
  requestParams.forEach(({ key, value }: any) => {
    const param = key + '=' + value;
    params.push(param);
  });
  return '?' + params.join('&');
};
// 发送一个request
export async function sendRequest(hopReq: any, environment: any) {
  // @ts-ignore
  const runner = new window.PostmanRuntime.Runner();
  const rawCollection = {
    info: {
      _postman_id: '7b650e98-a5d2-4925-b23c-a4fb33a14832',
      name: 'test',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      _exporter_id: '14623557',
    },
    item: [
      {
        name: hopReq.name,
        event: [
          {
            listen: 'prerequest',
            script: {
              exec: [hopReq.preRequestScript],
              type: 'text/javascript',
            },
          },
          {
            listen: 'test',
            script: {
              exec: [hopReq.testScript],
              type: 'text/javascript',
            },
          },
        ],
        request: {
          method: hopReq.method,
          header: hopReq.headers,
          body: convertToPmBody(hopReq.body),
          url: sdk.Url.parse(hopReq.endpoint + converToUrl(hopReq.params)),
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
          name: environment.name,
          values: environment.variables,
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
            return base64.split(';base64,')[1];
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
            console.log('');
          },
          responseData: function (cursor: any, data: any) {
            console.log('');
          },
          item: function (err: any, cursor: any, item: any, visualizer: any) {
            console.log('pm logs:', consolesBox);
            resolve({
              response: res,
              testResult: assertionsBox,
              consoles: consolesBox,
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
              headers: Object.keys(response.headers).map((key) => ({
                key: key,
                value: String(response.headers[key]),
              })),
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
