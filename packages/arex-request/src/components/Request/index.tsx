import { SendOutlined } from '@ant-design/icons';
import { css, Label, RequestMethod, styled } from '@arextest/arex-core';
import { Button, Checkbox, Select } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { sendRequest } from '../../helpers';
import { useArexRequestProps, useArexRequestStore } from '../../hooks';
import { ArexEnvironment, ArexRESTRequest, ArexRESTResponse } from '../../types';
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
    reqData: { request: ArexRESTRequest; environment?: ArexEnvironment },
    resData: Awaited<ReturnType<typeof sendRequest>>,
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

  const handleRequest = async () => {
    dispatch((state) => {
      state.response = {
        type: 'loading',
        headers: undefined,
      };
    });
    const res = await sendRequest(onBeforeRequest(store.request), store.environment);

    onRequest?.({ request: store.request, environment: store.environment }, res);
    dispatch((state) => {
      state.response = res.response;
      state.consoles = res.consoles;
      state.visualizer = res.visualizer;
      state.testResult = res.testResult;
    });
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
            icon={<SendOutlined />}
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
