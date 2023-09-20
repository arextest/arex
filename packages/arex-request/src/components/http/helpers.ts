import PM, { UrlDefinition } from 'postman-collection';

export const converToUrl = (requestParams: any) => {
  const params: any = [];
  requestParams.forEach(({ key, value }: any) => {
    const param = key + '=' + value;
    params.push(param);
  });
  return '?' + params.join('&');
};

export const removePMparams = (endpointParse: UrlDefinition) => {
  return new PM.Url({
    auth: endpointParse.auth,
    hash: endpointParse.hash,
    host: endpointParse.host,
    path: endpointParse.path,
    port: endpointParse.port,
    variable: endpointParse.variable,
    protocol: endpointParse.protocol,
    query: [],
  });
};
