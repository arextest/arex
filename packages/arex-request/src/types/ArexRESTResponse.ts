// 修改点
// 1.删除了 req ArexRESTRequest
// 2.body 为any
import { ArexRESTHeader } from './ArexRESTHeader';

export type ArexRESTResponse =
  | { type: 'loading'; headers: undefined }
  | { type: 'extensionNotInstalled'; headers: undefined }
  | {
      type: 'fail';
      headers: ArexRESTHeader[];
      body: any;
      statusCode: number;
      meta: {
        responseSize: number; // in bytes
        responseDuration: number; // in millis
      };
    }
  | {
      type: 'network_fail';
      headers: undefined;
      error: Error;
    }
  | {
      type: 'script_fail';
      headers: undefined;
      error: Error;
    }
  | {
      type: 'success';
      headers: ArexRESTHeader[];
      body: any;
      statusCode: number;
      meta: {
        responseSize: number; // in bytes
        responseDuration: number; // in millis
      };
    };
