import PM, { UrlDefinition } from 'postman-collection';

export const removePMParams = (endpointParse: UrlDefinition) => {
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
