import Icon, { StopOutlined } from '@ant-design/icons';
import { EmptyWrapper, FlexCenterWrapper } from '@arextest/arex-core';
import { Button, Typography } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestStore } from '../../hooks';
import ResponseOptions from './ResponseOptions';

const Response = () => {
  const { store, dispatch } = useArexRequestStore();
  const { t } = useTranslation();

  const handleCancelRequest = useCallback(
    () =>
      dispatch((state) => {
        state.response = undefined;
      }),
    [],
  );

  const hasResponse = useMemo(
    () => ['extensionNotInstalled', 'success', 'fail'].includes(store.response?.type || ''),
    [store.response],
  );

  const loading = useMemo(
    () => store.response === null || store?.response?.type === 'loading',
    [store.response],
  );

  return (
    <EmptyWrapper
      loading={loading}
      empty={!hasResponse}
      description={
        <Typography.Text type='secondary'>{t('response.sendRequestTip')}</Typography.Text>
      }
      loadingTip={
        <Button
          id='arex-request-cancel-btn'
          icon={<StopOutlined />}
          onClick={handleCancelRequest}
          style={{ marginTop: '8px' }}
        >
          {t('action.cancel')}
        </Button>
      }
    >
      {store.response?.type === 'extensionNotInstalled' ? (
        <FlexCenterWrapper>
          <Icon
            style={{ margin: '8px' }}
            component={() => (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-plug-zap'
              >
                <path d='M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z' />
                <path d='m2 22 3-3' />
                <path d='M7.5 13.5 10 11' />
                <path d='M10.5 16.5 13 14' />
                <path d='m18 3-4 4h6l-4 4' />
              </svg>
            )}
          />

          <Typography.Text type='secondary'>{t('error.extensionNotInstalled')}</Typography.Text>
          <Button
            type='link'
            target='_blank'
            href='https://chromewebstore.google.com/detail/arex-chrome-extension/jmmficadjneeekafmnheppeoehlgjdjj?hl=zh-CN'
          >
            {t('error.downloadExtension')}
          </Button>
        </FlexCenterWrapper>
      ) : (
        <ResponseOptions
          response={store.response}
          testResult={store.testResult}
          consoles={store.consoles}
        />
      )}
    </EmptyWrapper>
  );
};

export default Response;
