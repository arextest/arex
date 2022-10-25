export function convertRequestData(requestData) {
  console.log(requestData.body.address.method, 'req');
  return {
    method: requestData.body.address.method,
    endpoint: requestData.body.address.endpoint,
    body: requestData.body.body,
    testScript: requestData.body.testScript,
    headers: requestData.body.headers,
    params: requestData.body.params,
  };
}
