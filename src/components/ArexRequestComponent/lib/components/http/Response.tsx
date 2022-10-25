import { useContext, useMemo } from 'react';

// import { requestUseStore } from '../../store/request';
import LensesResponseBodyRenderer from '../lenses/ResponseBodyRenderer';
import { HttpContext } from '../..';
import HttpResponseMeta from './ResponseMeta';
import { DatePicker, TimePicker } from 'antd';
import { css } from '@emotion/react';

const HttpResponse = () => {
  const { store } = useContext(HttpContext);
  const hasResponse = useMemo(
    () => store.response.type === 'success' || store.response.type === 'fail',
    [store.response],
  );
  const loading = useMemo(
    () => store.response.type === null || store.response.type === 'loading',
    [store.response],
  );

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
        padding-left: 16px;
      `}
    >
      <HttpResponseMeta response={store.response} />
      {!loading && hasResponse ? <LensesResponseBodyRenderer response={store.response} /> : null}
    </div>
  );
};

export default HttpResponse;
