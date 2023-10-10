import { SaveOutlined } from '@ant-design/icons';
import { css, RequestMethod, SpaceBetweenWrapper, styled } from '@arextest/arex-core';
import { Button, Checkbox, Divider, Dropdown, Select, Space } from 'antd';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { sendRequest } from '../../helpers';
import { useArexRequestProps, useArexRequestStore } from '../../hooks';
import { ArexEnvironment, ArexRESTRequest, ArexRESTResponse } from '../../types';
import SmartBreadcrumb, { SmartBreadcrumbProps } from '../smart/Breadcrumb';
import EnvInput from '../smart/EnvInput';
import EnvironmentSelect, { EnvironmentSelectProps } from './EnvironmentSelect';

const HeaderWrapper = styled.div`
  padding: 0 8px;
  display: flex;
  .ant-select-selector {
    border-radius: 6px 0 0 6px;
  }
`;

export type HttpRequestProps = {
  disableSave?: boolean;
  onBeforeSend?: (request: ArexRESTRequest, environment?: ArexEnvironment) => ArexRESTRequest;
  onSave?: (request?: ArexRESTRequest, response?: ArexRESTResponse) => void;
  onSaveAs?: () => void;
} & SmartBreadcrumbProps & {
    environmentProps?: EnvironmentSelectProps;
  };

const HttpRequest: FC<HttpRequestProps> = () => {
  const {
    onSave,
    onSaveAs,
    onBeforeSend = (request) => request,
    disableSave,
  } = useArexRequestProps();
  const { store, dispatch } = useArexRequestStore();
  const { t } = useTranslation();

  const reset = () => {
    dispatch((state) => {
      state.response = undefined;
    });
  };

  const handleRequest = async () => {
    dispatch((state) => {
      state.response = {
        type: 'loading',
        headers: undefined,
      };
    });
    const res = await sendRequest?.(onBeforeSend(store.request), store.environment);
    dispatch((state) => {
      if (res.response.type === 'success') {
        state.response = res.response;
        state.consoles = res.consoles;
        state.visualizer = res.visualizer;
        state.testResult = res.testResult;
      }
    });
  };

  const buttonsItems = useMemo(
    () => [
      {
        key: 'saveAs',
        label: t('request.save_as'),
        icon: <SaveOutlined />,
      },
    ],
    [t],
  );

  const onMenuClick = ({ key }: { key: string }) => {
    key === 'saveAs' && onSaveAs?.();
  };

  return (
    <div>
      <SpaceBetweenWrapper>
        <SpaceBetweenWrapper style={{ marginLeft: '8px', flex: 1 }}>
          <SmartBreadcrumb />

          <Space size='middle' style={{ float: 'right', marginRight: '8px' }}>
            <Dropdown.Button
              size='small'
              disabled={disableSave}
              menu={{ items: buttonsItems, onClick: onMenuClick }}
              onClick={() => onSave?.(store.request, store.response)}
            >
              <SaveOutlined />
              {t('request.save')}
            </Dropdown.Button>
          </Space>
        </SpaceBetweenWrapper>

        <EnvironmentSelect />
      </SpaceBetweenWrapper>

      <Divider style={{ width: '100%', margin: '0 0 8px 0' }} />

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
          <Checkbox
            css={css`
              margin-top: 5px;
              margin-right: 5px;
            `}
            checked={store.request.inherited}
            onChange={(val) => {
              dispatch((state) => {
                state.request.inherited = val.target.checked;
              });
            }}
          />
        )}

        <div style={{ marginLeft: '8px' }}>
          {store.response?.type === 'loading' ? (
            <Button id={'arex-request-cancel-btn'} onClick={reset}>
              {t('action.cancel')}
            </Button>
          ) : (
            <Button id={'arex-request-send-btn'} type='primary' onClick={handleRequest}>
              {t('action.send')}
            </Button>
          )}
        </div>
      </HeaderWrapper>
    </div>
  );
};

export default HttpRequest;
