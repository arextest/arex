import { styled } from '@arextest/arex-core';
import React, { useMemo } from 'react';

import { useArexRequestStore } from '../../hooks';
import LensesResponseBodyRenderer from '../lenses/ResponseBodyRenderer';
import HttpResponseMeta from './ResponseMeta';

const HttpResponseWrapper = styled.div`
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const HttpResponse = () => {
  const { store } = useArexRequestStore();

  const hasResponse = useMemo(
    () => store.response?.type === 'success' || store.response?.type === 'fail',
    [store.response],
  );
  const loading = useMemo(
    () => store.response === null || store?.response?.type === 'loading',
    [store.response],
  );

  return (
    <HttpResponseWrapper>
      <HttpResponseMeta response={store.response} />
      {!loading && hasResponse && (
        <LensesResponseBodyRenderer
          response={store.response}
          testResult={store.testResult}
          consoles={store.consoles}
        />
      )}
    </HttpResponseWrapper>
  );
};

export default HttpResponse;
