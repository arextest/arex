import { ArexRESTAuth } from './ArexRESTAuth';
import { ArexRESTHeader } from './ArexRESTHeader';
import { ArexRESTParam } from './ArexRESTParam';
import { ArexRESTReqBody } from './ArexRESTReqBody';

export interface ArexRESTRequest {
  v: string;
  id: string; // Firebase Firestore ID
  name: string;
  method: string;
  endpoint: string;
  params: ArexRESTParam[];
  headers: ArexRESTHeader[];
  preRequestScript: string;
  testScript: string;
  auth: ArexRESTAuth;
  body: ArexRESTReqBody;
  // add for arex
  inherited: boolean;
  inheritedEndpoint: string;
  inheritedMethod: string;
  description: string;
}
