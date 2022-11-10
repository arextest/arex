export function convertRequestData(requestData, address) {
  if (requestData.body) {
    return {
      method: requestData.body[address]?.method || 'GET',
      endpoint: requestData.body[address]?.endpoint || '',
      body: requestData.body.body || {
        body: '',
        contentType: 'application/json',
      },
      testScript: requestData.body.testScript || '',
      headers: requestData.body.headers || [],
      params: requestData.body.params || [],
      compareEndpoint: requestData.body?.testAddress?.endpoint || '',
      compareMethod: requestData.body?.testAddress?.method || 'GET',
      recordId: requestData.body?.recordId,
    };
  } else {
    return {
      method: 'GET',
      endpoint: '',
      body: {
        body: '',
        contentType: 'application/json',
      },
      testScript: '',
      headers: [],
      params: [],
      compareEndpoint: '',
      compareMethod: 'GET',
      recordId: requestData.body?.recordId,
    };
  }
}
