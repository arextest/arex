import { css } from '@emotion/react';
import { FC, useContext, useMemo } from 'react';
import React from 'react';

import { HttpContext, TabConfig } from '../..';
import { LensesHeadersRendererEntryProps } from '../lenses/HeadersRendererEntry';
import LensesResponseBodyRenderer from '../lenses/ResponseBodyRenderer';
import HttpResponseMeta from './ResponseMeta';

const ResponseTabs: FC<{ onPin: LensesHeadersRendererEntryProps['onPin']; config?: TabConfig }> = ({
  onPin,
  config,
}) => {
  const { store } = useContext(HttpContext);
  const hasResponse = useMemo(
    () =>
      store.response?.type === 'success' ||
      store.response?.type === 'fail' ||
      store.response?.type === 'empty',
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
      `}
    >
      <HttpResponseMeta response={store.response} />
      {!loading && hasResponse && (
        <LensesResponseBodyRenderer
          onPin={onPin}
          response={store.response}
          testResult={store.testResult}
          config={config}
        />
      )}
    </div>
  );
};

export default ResponseTabs;
