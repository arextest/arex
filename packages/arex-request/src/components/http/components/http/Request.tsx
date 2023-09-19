import { SaveOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Checkbox, Divider, Select, Space } from 'antd';
import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Context } from '../../../../providers/RequestProvider';
import { HttpProps } from '../../index';
import SmartBreadcrumb from '../smart/Breadcrumb';
import EnvInput from '../smart/EnvInput';
import EnvironmentSelect from './EnvironmentSelect';

const HeaderWrapper = styled.div`
  padding: 0 8px;
  display: flex;
  .ant-select-selector {
    border-radius: 6px 0 0 6px;
  }
`;

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
interface HttpRequestProps {
  onSave: HttpProps['onSave'];
  onSend: HttpProps['onSend'];
  onSaveAs: HttpProps['onSaveAs'];
  breadcrumbItems: { title: string }[];
  onChange: HttpProps['onChange'];
  description: string;
  tags: string[];
  tagOptions: { color: string; label: string; value: string }[];
  disableSave: boolean;
}
const HttpRequest: FC<HttpRequestProps> = ({
  onSave,
  onSaveAs,
  onSend,
  onChange,
  breadcrumbItems,
  description,
  tagOptions,
  tags,
  disableSave,
}) => {
  const { store, dispatch } = useContext(Context);
  const { t } = useTranslation();
  const reset = () => {
    dispatch((state) => {
      state.response = null;
    });
  };

  const handleRequest = () => {
    dispatch((state) => {
      state.response = {
        type: 'loading',
      };
    });
    onSend(store.request).then((responseAndTestResult: any) => {
      dispatch((state) => {
        if (responseAndTestResult.response.type === 'success') {
          state.response = responseAndTestResult.response;
          state.testResult = responseAndTestResult.testResult;
          state.consoles = responseAndTestResult.consoles;
          state.visualizer = responseAndTestResult.visualizer;
        }
      });
    });
  };
  return (
    <div>
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
        `}
      >
        <div style={{ marginLeft: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <SmartBreadcrumb
            tags={tags}
            tagOptions={tagOptions}
            description={description}
            titleItems={breadcrumbItems}
            onChange={onChange}
          />

          <Space style={{ float: 'right' }}>
            <Button
              id={'arex-request-save-btn'}
              size='small'
              disabled={disableSave}
              icon={<SaveOutlined />}
              onClick={() => {
                const request = JSON.parse(JSON.stringify(store.request));
                if (request.body.contentType === '0') {
                  request.body.body = '';
                }
                // @ts-ignore
                onSave(request, store.response);
              }}
            >
              {t('action.save')}
            </Button>
            {store.request.id?.length === 12 && (
              <Button
                id={'arex-request-saveas-btn'}
                size='small'
                type='primary'
                disabled={disableSave}
                onClick={onSaveAs}
              >
                Save As
              </Button>
            )}
          </Space>
        </div>
        <EnvironmentSelect />
      </div>

      <Divider style={{ width: '100%', margin: '0 0 8px 0' }} />

      <HeaderWrapper>
        <Select
          disabled={Boolean(store.request.inherited)}
          css={css`
            width: 120px;
            transform: translateX(1px);
          `}
          value={store.request.inherited ? store.request.inheritedMethod : store.request.method}
          options={methods.map((i) => ({ value: i, lable: i }))}
          onChange={(value) => {
            dispatch((state) => {
              state.request.method = value;
            });
          }}
        />
        <EnvInput
          disabled={Boolean(store.request.inherited)}
          value={store.request.inherited ? store.request.inheritedEndpoint : store.request.endpoint}
          onChange={(v) => {
            dispatch((state) => {
              state.request.endpoint = v;
            });
          }}
        />

        <Checkbox
          css={css`
            margin-top: 5px;
            margin-right: 5px;
            display: ${store.request.inherited === undefined ? 'none' : 'inline:block'};
          `}
          checked={store.request.inherited}
          onChange={(val) => {
            dispatch((state) => {
              state.request.inherited = val.target.checked;
            });
          }}
        />

        <div style={{ marginLeft: '8px' }}>
          {store.response?.type === 'loading' ? (
            <Button onClick={() => reset()} id={'arex-request-cancel-btn'}>
              {t('action.cancel')}
            </Button>
          ) : (
            <Button onClick={() => handleRequest()} type='primary' id={'arex-request-send-btn'}>
              {t('action.send')}
            </Button>
          )}
        </div>
      </HeaderWrapper>
    </div>
  );
};

export default HttpRequest;
