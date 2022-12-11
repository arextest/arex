// 修改点
// 1.删除了 req HoppRESTRequest
// 2.body 为any
export type HoppRESTResponse =
  | { type: 'loading' }
  | {
      type: 'fail';
      headers: { key: string; value: string }[];
      body: any;
      statusCode: number;

      meta: {
        responseSize: number; // in bytes
        responseDuration: number; // in millis
      };
    }
  | {
      type: 'network_fail';
      error: Error;
    }
  | {
      type: 'script_fail';
      error: Error;
    }
  | {
      type: 'success';
      headers: { key: string; value: string }[];
      body: any;
      statusCode: number;
      meta: {
        responseSize: number; // in bytes
        responseDuration: number; // in millis
      };
    };
