import { ArexRESTRequest } from '@arextest/arex-request';

export const requestCollection: ArexRESTRequest[] = [
  {
    id: '-1',
    preRequestScript: '',
    v: '',
    headers: [],
    name: 'POST Request',
    description: '',
    body: {
      contentType: 'application/json;charset=UTF-8',
      body: JSON.stringify(
        {
          name: 'zfdhdfhdfhfghtzfdhdfhdfhfghtzfdhdfhdfhfghtzfdhdfhdfhfghtzfdhdfhdfhfghtzfdhdfhdfhfghtzfdhdfhdfhfghtzfdhdfhdfhfghtzfdhdfhdfhfghtzfdhdfhdfhfghtzfdhdfhdfhfghtdfhfghsfsafsa,mnfmsdbfmgdsjhfgbsdjhfgsdhjfghjsdgfjhsdgjfhsdghjsdjhsdhjgt',
        },
        null,
        2,
      ),
    } as any,
    auth: { authActive: false, authType: 'none' },
    testScript: '',
    endpoint: '{{url}}/put',
    method: 'POST',
    params: [],
    inherited: false,
    inheritedEndpoint: '{{url}}/put',
    inheritedMethod: 'PUT',
  },
  {
    id: '1',
    preRequestScript: '',
    v: '',
    headers: [],
    name: 'GET request',
    description: '',
    body: { contentType: 'application/json', body: '' },
    auth: { authActive: false, authType: 'none' },
    testScript: '',
    endpoint:
      'http://127.0.0.1:8081/api/report/listRecord?test1=testvalue&dsadsadas=dasdsdas&dsadasd=null',
    method: 'GET',
    params: [],
    inherited: false,
    inheritedEndpoint: '{{url}}/put',
    inheritedMethod: 'PUT',
  },
];
