export type ArexRESTAuthNone = {
  authType: 'none';
};

export type ArexRESTAuthBasic = {
  authType: 'basic';

  username: string;
  password: string;
};

export type ArexRESTAuthBearer = {
  authType: 'bearer';

  token: string;
};

export type ArexRESTAuthOAuth2 = {
  authType: 'oauth-2';

  token: string;
  oidcDiscoveryURL: string;
  authURL: string;
  accessTokenURL: string;
  clientID: string;
  scope: string;
};

export type ArexRESTAuthAPIKey = {
  authType: 'api-key';
  key: string;
  value: string;
  addTo: string;
};

export type ArexRESTAuth = { authActive: boolean } & (
  | ArexRESTAuthNone
  | ArexRESTAuthBasic
  | ArexRESTAuthBearer
  | ArexRESTAuthOAuth2
  | ArexRESTAuthAPIKey
);
