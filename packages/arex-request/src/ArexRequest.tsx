import React, { forwardRef } from 'react';

import Request, { RequestProps, RequestRef } from './components/Request';
import { RequestPropsProvider, RequestStoreProvider } from './providers';

const ArexRequest = forwardRef<RequestRef, RequestProps>((props, ref) => {
  return (
    <RequestPropsProvider {...props}>
      <RequestStoreProvider request={props.data}>
        <Request {...props} ref={ref} />
      </RequestStoreProvider>
    </RequestPropsProvider>
  );
});

export default ArexRequest;
