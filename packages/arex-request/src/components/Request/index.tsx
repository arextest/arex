import { ExclamationOutlined, SendOutlined } from '@ant-design/icons';
import { css, Label, RequestMethod, styled } from '@arextest/arex-core';
import { Button, Checkbox, Select } from 'antd';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { sendRequest } from '../../helpers';
import { useArexRequestProps, useArexRequestStore } from '../../hooks';
import { ArexEnvironment, ArexResponse, ArexRESTRequest, ArexRESTResponse } from '../../types';
import { EnvironmentSelectProps } from '../NavigationBar/EnvironmentSelect';
import { InfoSummaryProps } from '../NavigationBar/InfoSummary';
import EnvInput from './EnvInput';
import HttpRequestOptions from './RequestOptions';

const HeaderWrapper = styled.div`
  padding: 0 8px;
  display: flex;
  .ant-select-selector {
    border-radius: 6px 0 0 6px;
  }
`;

export type RequestProps = {
  disableSave?: boolean;
  onBeforeRequest?: (request: ArexRESTRequest, environment?: ArexEnvironment) => ArexRESTRequest;
  onRequest?: (
    error: Error | null,
    reqData: { request: ArexRESTRequest; environment?: ArexEnvironment },
    resData: Awaited<ReturnType<typeof sendRequest>> | null,
  ) => void;
  onSave?: (request?: ArexRESTRequest, response?: ArexRESTResponse) => void;
  onSaveAs?: () => void;
} & InfoSummaryProps & {
    environmentProps?: EnvironmentSelectProps;
  };

const Request: FC<RequestProps> = () => {
  const { onBeforeRequest = (request: ArexRESTRequest) => request, onRequest } =
    useArexRequestProps();
  const { store, dispatch } = useArexRequestStore();
  const { t } = useTranslation();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  const [endpointStatus, setEndpointStatus] = useState<'error'>();

  const handleRequest = async () => {
    if (!store.request.endpoint) {
      setEndpointStatus('error');
      if (timeoutId) clearTimeout(timeoutId);
      setTimeoutId(
        setTimeout(() => {
          setEndpointStatus(undefined);
        }, 3000),
      );
      window.message.error(t('error.emptyEndpoint'));
      return;
    }
    const ready = isClient || window.__AREX_EXTENSION_INSTALLED__;
    dispatch((state) => {
      state.response = {
        type: ready ? 'loading' : 'EXTENSION_NOT_INSTALLED',
        headers: undefined,
      };
    });

    if (!ready) return;
    request();
  };

  return (
    <div style={{ height: '100%' }}>
      <HeaderWrapper>
        <Select
          disabled={store?.request?.inherited}
          css={css`
            width: 80px;
            transform: translateX(1px);
          `}
          value={store?.request?.inherited ? store.request.inheritedMethod : store?.request?.method}
          options={RequestMethod.map((i: string) => ({ value: i, label: i }))}
          onChange={(value) => {
            dispatch((state) => {
              state.request.method = value;
            });
          }}
        />

        <EnvInput
          disabled={store.request.inherited}
          status={endpointStatus}
          value={store.request.inherited ? store.request.inheritedEndpoint : store.request.endpoint}
          onChange={(v) => {
            dispatch((state) => {
              state.request.endpoint = v || '';
            });
          }}
        />

        {store.request.inherited && (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
            <Label type='secondary'>{t('request.inherit')}</Label>
            <Checkbox
              checked={store.request.inherited}
              onChange={(val) => {
                dispatch((state) => {
                  state.request.inherited = val.target.checked;
                });
              }}
            />
          </div>
        )}

        <div style={{ marginLeft: '8px' }}>
          <Button
            id='arex-request-send-btn'
            type='primary'
            loading={store.response?.type === 'loading'}
            disabled={store.response?.type === 'EXTENSION_NOT_INSTALLED'}
            icon={
              store.response?.type === 'EXTENSION_NOT_INSTALLED' ? (
                <ExclamationOutlined />
              ) : (
                <SendOutlined />
              )
            }
            onClick={handleRequest}
          >
            {t('action.send')}
          </Button>
        </div>
      </HeaderWrapper>

      <HttpRequestOptions />
    </div>
  );
};

export default Request;
