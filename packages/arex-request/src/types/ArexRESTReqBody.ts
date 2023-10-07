import { ArexContentTypes } from './ArexContentTypes';
import { ArexRESTReqBodyFormData } from './ArexRESTReqBodyFormData';

export type ArexRESTReqBody =
  | {
      contentType: Exclude<ArexContentTypes, 'multipart/form-data'>;
      body: string;
    }
  | ArexRESTReqBodyFormData
  | {
      contentType: undefined;
      body: undefined;
    };
