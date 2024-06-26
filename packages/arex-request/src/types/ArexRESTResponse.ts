import { ArexRESTHeader } from './ArexRESTHeader';

export type ArexRESTResponse = {
  type:
    | 'loading'
    | 'success'
    | 'fail'
    | 'EXTENSION_NOT_INSTALLED'
    | 'ETIMEDOUT'
    | 'network_fail'
    | 'script_fail';
  headers?: ArexRESTHeader[];
  body?: any;
  statusCode?: number;
  meta?: {
    responseSize: number; // in bytes
    responseDuration: number; // in millis
  };
  error?: Error;
};
