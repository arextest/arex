import { ArexContentTypes } from './ArexContentTypes';

export type ArexRESTReqBody = {
  contentType: ArexContentTypes;
  body: string;
  formData: { key: string; value: string }[];
};
