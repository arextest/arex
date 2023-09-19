import { css, jsx } from '@emotion/react';
import { DatePicker, TimePicker } from 'antd';
import { useContext, useMemo } from 'react';
import React from 'react';

import { Context } from '../../../../providers/ConfigProvider';
import { ArexRESTResponse } from '../../helpers/types/ArexRESTResponse';
import { PostmanTestResult } from '../../helpers/types/PostmanTestResult';
// import { HoppTestResult } from '../../helpers/types/HoppTestResult';
import LensesResponseBodyRenderer from '../lenses/ResponseBodyRenderer';
import HttpResponseMeta from './ResponseMeta';

const HttpResponse = () => {
  const { store } = useContext(Context);
  const hasResponse = useMemo(
    () => store.response?.type === 'success' || store.response?.type === 'fail',
    [store.response],
  );
  const loading = useMemo(
    () => store.response === null || store.response.type === 'loading',
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
          testResult={store.testResult as PostmanTestResult}
          consoles={store.consoles}
        />
      ) : null}
    </div>
  );
};

export default HttpResponse;
