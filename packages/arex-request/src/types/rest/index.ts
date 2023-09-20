import { ValidContentTypes } from './content-types';
import { HoppRESTAuth } from './HoppRESTAuth';

export * from './content-types';
export * from './HoppRESTAuth';

export const RESTReqSchemaVersion = '1';

export type HoppRESTParam = {
  key: string;
  value: string;
  active: boolean;
};

export type HoppRESTHeader = {
  key: string;
  value: string;
  active: boolean;
};

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

export interface ArexRESTRequest {
  v: string;
  id?: string; // Firebase Firestore ID

  name: string;
  method: string;
  endpoint: string;
  params: HoppRESTParam[];
  headers: HoppRESTHeader[];
  preRequestScript: string;
  testScript: string;

  auth: HoppRESTAuth;

  body: HoppRESTReqBody;

  // 为arex加的
  inherited: boolean;
  inheritedEndpoint: string;
  inheritedMethod: string;
  description: string;
}

export function makeRESTRequest(x: Omit<ArexRESTRequest, 'v'>): ArexRESTRequest {
  return {
    ...x,
    v: RESTReqSchemaVersion,
  };
}

export function isHoppRESTRequest(x: any): x is ArexRESTRequest {
  return x && typeof x === 'object' && 'v' in x;
}

function parseRequestBody(x: any): HoppRESTReqBody {
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

export function translateToNewRequest(x: any): ArexRESTRequest {
  if (isHoppRESTRequest(x)) {
    return x;
  } else {
    // Old format
    const endpoint = `${x?.url ?? ''}${x?.path ?? ''}`;

    const headers: HoppRESTHeader[] = x?.headers ?? [];

    // Remove old keys from params
    const params: HoppRESTParam[] = (x?.params ?? []).map(
      ({ key, value, active }: { key: string; value: string; active: boolean }) => ({
        key,
        value,
        active,
      }),
    );

    const name = x?.name ?? 'Untitled request';
    const method = x?.method ?? '';

    const preRequestScript = x?.preRequestScript ?? '';
    const testScript = x?.testScript ?? '';

    const body = parseRequestBody(x);

    const auth = parseOldAuth(x);

    const result: ArexRESTRequest = {
      name,
      endpoint,
      headers,
      params,
      method,
      preRequestScript,
      testScript,
      body,
      auth,
      inherited: true,
      inheritedEndpoint: '',
      inheritedMethod: '',
      description: '',
      v: RESTReqSchemaVersion,
    };

    if (x.id) result.id = x.id;

    return result;
  }
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
