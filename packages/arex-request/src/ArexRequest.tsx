import React, { forwardRef } from 'react';

import Request, { RequestProps } from './components/Request';
import { RequestPropsProvider, RequestStoreProvider } from './providers';

const ArexRequest = forwardRef<any, RequestProps>((props, ref) => {
  return (
    <RequestPropsProvider {...props}>
      <RequestStoreProvider>
        <Request {...props} />
      </RequestStoreProvider>
    </RequestPropsProvider>
  );
});

export default ArexRequest;
