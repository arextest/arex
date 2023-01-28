import { DownOutlined, SaveOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { App, Button, Divider, Dropdown, MenuProps, Select, Space } from 'antd';
import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { METHODS } from '../../../../constant';
import { flattenArray } from '../../../panes/BatchComparePage/util';
import { SpaceBetweenWrapper } from '../../../styledComponents';
import { HoppRESTRequest } from '../../data/rest';
import CollectionBreadcrumb from '../../extra/CollectionBreadcrumb';
import { HoppRESTResponse } from '../../helpers/types/HoppRESTResponse';
import { urlPretreatment } from '../../helpers/utils/util';
import { HttpContext, HttpProps, State } from '../../index';
import SmartEnvInput from '../smart/EnvInput';

const RequestMethodUrlWrapper = styled.div`
  display: flex;
  & > * {
    flex: 1;
  }
  & > .send-request-button {
    flex-grow: 0;
  }
  .ant-select > .ant-select-selector {
    width: 120px;
    .ant-select-selection-item {
      font-weight: 500;
    }
  }
`;

const RequestModeOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'Compare', value: 'compare' },
];

const items: MenuProps['items'] = [
  {
    label: 'Send Compare',
    key: 'compare',
  },
];

interface HttpRequestProps {
  id: string;
  labelIds?: string[];
  nodeType: number;
  nodePath: string[];
  onSend: HttpProps['onSend'];
  onPreSend: HttpProps['onPreSend'];
  onSave: HttpProps['onSave'];
  onSendCompare: HttpProps['onSendCompare'];
}

const HttpRequest: FC<HttpRequestProps> = (props) => {
  const { store, dispatch } = useContext(HttpContext);
  const { message } = App.useApp();
  const { t } = useTranslation();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    e.key === '1' && handleRequest('compare');
  };

  function checkRequestParams(requestParams: HoppRESTRequest) {
    const { body, endpoint } = requestParams;
    if (endpoint === '') {
      return {
        error: true,
        msg: 'please fill in endpoint.',
      };
    }

    if (body.contentType === 'application/json') {
      try {
        JSON.parse(body.body || '{}');
      } catch (e) {
        return {
          error: true,
          msg: 'json format error',
        };
      }
    }
    return {
      error: false,
      msg: '',
    };
  }

  const handleRequest = (type: State['mode']) => {
    if (checkRequestParams(store.request).error) {
      message.error(checkRequestParams(store.request).msg);
      return;
    }
    if (type === 'compare') {
      dispatch((state) => {
        state.compareLoading = true;
      });
      props
        .onSendCompare({
          ...store.request,
          endpoint: urlPretreatment(store.request.endpoint, store.environment?.variables || []),
          compareEndpoint: urlPretreatment(
            store.request.compareEndpoint,
            store.environment?.variables || [],
          ),
          headers: store.request.headers.filter((f) => f.key !== '' && f.value !== ''),
          params: store.request.params.filter((f) => f.key !== '' && f.value !== ''),
        })
        .then((responseAndTestResult) => {
          dispatch((state) => {
            state.compareResult = {
              logs: flattenArray((responseAndTestResult.diffDetails || []).map((r: any) => r.logs)),
              responses: [
                JSON.parse(responseAndTestResult.baseMsg),
                JSON.parse(responseAndTestResult.testMsg),
              ],
            };
            state.compareLoading = false;
          });
        });
    } else {
      dispatch((state) => {
        state.response = {
          type: 'loading',
        };
      });
      // *** 参与校验分两种 1.重提醒，弹窗提示 2.静默处理，例如空值
      props
        .onPreSend({
          ...store.request,
        })
        .then((prTestResultEnvs) => {
          props
            .onSend({
              ...store.request,
              endpoint: urlPretreatment(store.request.endpoint, [
                ...(store.environment?.variables || []),
                ...prTestResultEnvs.prTestResultEnvs,
              ]),
              headers: store.request.headers.filter((f) => f.key !== '' && f.value !== ''),
              params: store.request.params.filter((f) => f.key !== '' && f.value !== ''),
            })
            .then((responseAndTestResult) => {
              dispatch((state) => {
                if (responseAndTestResult.response.type === 'success') {
                  state.response = responseAndTestResult.response;
                  state.testResult = responseAndTestResult.testResult;
                }
              });
            });
        });
    }
  };

  return (
    <Space direction='vertical'>
      <SpaceBetweenWrapper>
        <CollectionBreadcrumb
          id={props.id}
          nodeType={props.nodeType}
          nodePath={props.nodePath}
          defaultTags={props.labelIds}
        />

        <Space>
          <Select
            size='small'
            value={store.mode}
            options={RequestModeOptions}
            onChange={(value) => {
              dispatch((state) => {
                state.mode = value;
              });
            }}
            style={{ width: '100%' }}
          />

          <Divider type={'vertical'} />

          <Button
            size='small'
            icon={<SaveOutlined />}
            onClick={() => props.onSave(store.request, store.response as HoppRESTResponse)}
          >
            {t('action.save')}
          </Button>
        </Space>
      </SpaceBetweenWrapper>

      <RequestMethodUrlWrapper>
        <Space.Compact block>
          <Select
            value={store.request.method}
            options={METHODS.map((i) => ({ value: i, label: i }))}
            onChange={(value) => {
              dispatch((state) => {
                state.request.method = value;
              });
            }}
          />
          <SmartEnvInput
            value={store.request.endpoint}
            onChange={(value) => {
              dispatch((state) => {
                state.request.endpoint = value;
              });
            }}
          />
        </Space.Compact>

        <Dropdown.Button
          type='primary'
          className='send-request-button'
          icon={<DownOutlined />}
          menu={{
            items,
            onClick: handleMenuClick,
          }}
          onClick={() => handleRequest(store.mode)}
          style={{ marginLeft: '16px' }}
        >
          {t('action.send')}
        </Dropdown.Button>
      </RequestMethodUrlWrapper>

      {store.mode === 'compare' && (
        <RequestMethodUrlWrapper>
          <Space.Compact block style={{ marginRight: '112px' }}>
            <Select
              value={store.request.compareMethod}
              options={METHODS.map((i) => ({ value: i, label: i }))}
              onChange={(value) => {
                dispatch((state) => {
                  state.request.compareMethod = value;
                });
              }}
            />
            <SmartEnvInput
              value={store.request.compareEndpoint}
              onChange={(value) => {
                dispatch((state) => {
                  state.request.compareEndpoint = value;
                });
              }}
            />
          </Space.Compact>
        </RequestMethodUrlWrapper>
      )}
    </Space>
  );
};

export default HttpRequest;