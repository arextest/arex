import { css } from '@emotion/react';
import { Empty, Typography } from 'antd';
import { FC, useContext, useMemo } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import youre_lost_svg from '../../../../assets/youre_lost.svg';
import { HttpContext, TabConfig } from '../..';
import { LensesHeadersRendererEntryProps } from '../lenses/HeadersRendererEntry';
import LensesResponseBodyRenderer from '../lenses/ResponseBodyRenderer';
import HttpResponseMeta from './ResponseMeta';
const ResponseTabs: FC<{ onPin: LensesHeadersRendererEntryProps['onPin']; config?: TabConfig }> = ({
  onPin,
  config,
}) => {
  const { t } = useTranslation();
  const { store } = useContext(HttpContext);
  const hasResponse = useMemo(
    () => store.response?.type === 'success' || store.response?.type === 'empty',
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
      {/*  失败的界面*/}
      {!loading && store.response?.type === 'fail' && (
        <Empty
          image={youre_lost_svg}
          description={
            <Typography.Text type='secondary'>{t('helpers.network_fail')}</Typography.Text>
          }
        />
      )}
    </div>
  );
};

export default ResponseTabs;
