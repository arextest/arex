import { METHODS } from '../../../../constant';
import { KeyValueType } from '../../../../services/FileSystem.type';
import { ValidContentTypes } from './content-types';
import { HoppRESTAuth } from './HoppRESTAuth';

export * from './content-types';
export * from './HoppRESTAuth';

export const RESTReqSchemaVersion = '1';

export type FormDataKeyValue = {
  key: string;
  active: boolean;
} & ({ isFile: true; value: Blob[] } | { isFile: false; value: string });

export type HoppRESTReqBodyFormData = {
  contentType: 'multipart/form-data';
  body: FormDataKeyValue[];
};

export type HoppRESTReqBody =
  | {
      contentType: Exclude<ValidContentTypes, 'multipart/form-data'>;
      body: string;
    }
  | HoppRESTReqBodyFormData
  | {
      contentType: null;
      body: null;
    };

export type HoppRESTHeader = {
  key: string;
  value: string;
  active?: boolean;
};
interface RequestScript {
  icon: string;
  label: string;
  type: number;
  value: string;
}
export interface HoppRESTRequest {
  id?: string; // Firebase Firestore ID
  name: string | null;
  method: (typeof METHODS)[number];
  endpoint: string;
  compareMethod: (typeof METHODS)[number];
  compareEndpoint: string;
  inherited: boolean;
  params: KeyValueType[];
  headers: HoppRESTHeader[];
  preRequestScripts: {
    icon: string;
    label: string;
    type: number;
    value: string;
  }[];
  parentPreRequestScripts: RequestScript[];
  testScripts: RequestScript[];
  auth: HoppRESTAuth | null;
  body: { [key: string]: string };
  labelIds?: string[];
  description: string;
  parentValue?: HoppRESTRequest;
}

export function makeRESTRequest(x: HoppRESTRequest): HoppRESTRequest & { v: string } {
  return {
    ...x,
    v: RESTReqSchemaVersion,
  };
}

export function isHoppRESTRequest(x: any): x is HoppRESTRequest {
  return x && typeof x === 'object' && 'v' in x;
}

export function parseRequestBody(x: any): HoppRESTReqBody {
  if (x.contentType === 'application/json') {
    return {
      contentType: 'application/json',
      body: x.rawParams,
    };
  }

  return {
    contentType: 'application/json',
    body: '',
  };
}

export function parseOldAuth(x: any): HoppRESTAuth {
  if (!x.auth || x.auth === 'None')
    return {
      authType: 'none',
      authActive: true,
    };

  if (x.auth === 'Basic Auth')
    return {
      authType: 'basic',
      authActive: true,
      username: x.httpUser,
      password: x.httpPassword,
    };

  if (x.auth === 'Bearer Token')
    return {
      authType: 'bearer',
      authActive: true,
      token: x.bearerToken,
    };

  return { authType: 'none', authActive: true };
}
