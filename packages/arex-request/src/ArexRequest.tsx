import React, { forwardRef } from 'react';

import Request, { RequestProps, RequestRef } from './components/Request';
import RequestProvider from './providers/RequestProvider';

const ArexRequest = forwardRef<RequestRef, RequestProps>((props, ref) => {
  return (
    <RequestProvider>
      <Request {...props} ref={ref} />
    </RequestProvider>
  );
});

export default ArexRequest;
