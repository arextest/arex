import { css } from '@emotion/react';
import { useContext, useMemo } from 'react';

import { useHttpStore } from '../../store/useHttpStore';
import LensesResponseBodyRenderer from '../lenses/ResponseBodyRenderer';
import HttpResponseMeta from './ResponseMeta';

const HttpResponse = () => {
  const { response } = useHttpStore();
  const hasResponse = useMemo(
    () => response?.type === 'success' || response?.type === 'fail',
    [response],
  );
  const loading = useMemo(
    () => response?.type === null || response?.type === 'loading',
    [response],
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
      {response ? (
        <div
          css={css`
            height: 100%;
            display: flex;
            flex-direction: column;
          `}
        >
          <HttpResponseMeta response={response} />
          {!loading && hasResponse ? (
            <LensesResponseBodyRenderer response={response} testResult={{}} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default HttpResponse;
