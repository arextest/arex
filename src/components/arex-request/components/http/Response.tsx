import { css } from '@emotion/react';
import { DatePicker, TimePicker } from 'antd';
import { useContext, useMemo } from 'react';

import { HttpContext } from '../..';
import LensesResponseBodyRenderer from '../lenses/ResponseBodyRenderer';
import HttpResponseMeta from './ResponseMeta';

const HttpResponse = () => {
  const { store } = useContext(HttpContext);
  const hasResponse = useMemo(
    () => store.response.type === 'success' || store.response.type === 'fail',
    [store.response]
  );
  const loading = useMemo(
    () => store.response.type === null || store.response.type === 'loading',
    [store.response]
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
          response={store.response}
          testResult={store.testResult}
        />
      ) : null}
    </div>
  );
};

export default HttpResponse;
