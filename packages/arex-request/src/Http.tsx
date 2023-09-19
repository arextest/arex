import React, { forwardRef } from 'react';

import HttpInner, { HttpProps, HttpRef } from './components/http';
import RequestProvider from './providers/RequestProvider';

const Http = forwardRef<HttpRef, HttpProps & { theme: string; locale: string }>((props, ref) => {
  return (
    <RequestProvider {...props}>
      <HttpInner {...props} ref={ref} />
    </RequestProvider>
  );
});

export default Http;
