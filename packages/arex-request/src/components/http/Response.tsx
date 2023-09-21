import { css } from '@arextest/arex-core';
import React, { useMemo } from 'react';

import { useArexRequestStore } from '../../hooks';
import { ArexRESTResponse, ArexTestResult } from '../../types';
import LensesResponseBodyRenderer from '../lenses/ResponseBodyRenderer';
import HttpResponseMeta from './ResponseMeta';

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
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
        padding-left: 16px;
        padding-right: 16px;
      `}
    >
      <HttpResponseMeta response={store.response} />
      {!loading && hasResponse ? (
        <LensesResponseBodyRenderer
          response={store.response as ArexRESTResponse}
          testResult={store.testResult as ArexTestResult}
          consoles={store.consoles}
        />
      ) : null}
    </div>
  );
};

export default HttpResponse;
