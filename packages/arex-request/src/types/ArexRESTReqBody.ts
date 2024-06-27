import { ArexContentTypes } from './ArexContentTypes';
import { ArexRESTReqBodyFormData } from './ArexRESTReqBodyFormData';

export type ArexRESTReqBody = {
  contentType: ArexContentTypes | '0';
  body: string;
  formData: { key: string; value: string }[];
};
