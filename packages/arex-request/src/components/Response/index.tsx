import { StopOutlined } from '@ant-design/icons';
import { EmptyWrapper } from '@arextest/arex-core';
import { Button, Typography } from 'antd';
import React, { forwardRef, ReactNode, useCallback, useImperativeHandle, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestStore } from '../../hooks';
import { ArexRESTResponse } from '../../types';
import ETimeout from './ResponseError/ETimeout';
import ExtensionNotInstalled from './ResponseError/ExtensionNotInstalled';
import ResponseOptions from './ResponseOptions';

export type ResponseRef = {
  getResponse: () => ArexRESTResponse | undefined;
};

const Response = forwardRef<ResponseRef>((props, ref) => {
  const { store, dispatch } = useArexRequestStore();
  useImperativeHandle(ref, () => ({
    getResponse: () => store.response,
  }));

  const { t } = useTranslation();

  const handleCancelRequest = useCallback(
    () =>
      dispatch((state) => {
        state.response = undefined;
      }),
    [],
  );

  const loading = useMemo(
    () => store.response === null || store?.response?.type === 'loading',
    [store.response],
  );

  const response = useMemo(() => {
    let res: ReactNode;
    switch (store.response?.type) {
      case 'loading': {
        res = (
          <Typography.Text strong type='secondary'>
            Response
          </Typography.Text>
        );
        break;
      }
      case 'EXTENSION_NOT_INSTALLED': {
        res = <ExtensionNotInstalled />;
        break;
      }
      case 'ETIMEDOUT': {
        res = <ETimeout />;
        break;
      }
      default: {
        res = (
          <ResponseOptions
            response={store.response}
            testResult={store.testResult}
            consoles={store.consoles}
          />
        );
        break;
      }
    }
    return res;
  }, [store]);

  return (
    <EmptyWrapper
      loading={loading}
      empty={!store.response?.type}
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
      <div
        style={{
          padding: '8px 12px 0 12px',
          height: '100%',
        }}
      >
        {response}
      </div>
    </EmptyWrapper>
  );
});

export default Response;
