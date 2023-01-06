// 修改点
// 1.删除了 req HoppRESTRequest
// 2.body 为any
// 3.添加empty状态
import { HoppRESTHeader } from '../../data/rest';

export type HoppRESTResponse =
  | {
      type: 'empty';
      headers: HoppRESTHeader[];
      body: any;
      statusCode: number;
      meta: {
        responseSize: number; // in bytes
        responseDuration: number; // in millis
      };
    }
  | { type: 'loading' }
  | {
      type: 'fail';
      headers: HoppRESTHeader[];
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
      headers: HoppRESTHeader[];
      body: any;
      statusCode: number;
      meta: {
        responseSize: number; // in bytes
        responseDuration: number; // in millis
      };
    };
