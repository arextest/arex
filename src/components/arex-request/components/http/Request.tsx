import { DownOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breadcrumb, Button, Dropdown, Menu, MenuProps, message, Select } from 'antd';
import produce from 'immer';
import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { HoppRESTRequest } from '../../data/rest';
import { HoppRESTResponse } from '../../helpers/types/HoppRESTResponse';
import { HoppTestResult } from '../../helpers/types/HoppTestResult';
import { useHttpRequestStore } from '../../store/useHttpRequestStore';
import { useHttpStore } from '../../store/useHttpStore';
import SmartEnvInput from '../smart/EnvInput';
import testResult from './TestResult';

const HeaderWrapper = styled.div`
  display: flex;

  .ant-select > .ant-select-selector {
    width: 120px;
    left: 1px;
    border-radius: 2px 0 0 2px;
    .ant-select-selection-item {
      font-weight: 500;
    }
  }
  .ant-input {
    border-radius: 0 2px 2px 0;
  }
`;

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

// preRequestScript: '',
//   v: '',
//   headers: [],
//   name: '',
//   body: {
//   contentType: 'application/json',
//     body: '',
// },
// auth: {
//   authURL: 'http://petstore.swagger.io/api/oauth/dialog',
//     oidcDiscoveryURL: '',
//     accessTokenURL: '',
//     clientID: '',
//     scope: 'write:pets read:pets',
//     token: '',
//     authType: 'oauth-2',
//     authActive: true,
// },
// testScript: '',
//   endpoint: '',
//   method: '',
//   params: [],

interface HttpRequestProps {
  onSend: (
    r: HoppRESTRequest,
  ) => Promise<{ response: HoppRESTResponse; testResult: HoppTestResult }>;
  onSave: (r: HoppRESTRequest) => void;
  breadcrumb: any;
}

const HttpRequest: FC<HttpRequestProps> = ({ onSend, breadcrumb, onSave }) => {
  const {
    name,
    method,
    headers,
    params,
    endpoint,
    body,
    preRequestScript,
    testScript,
    v,
    auth,
    setHttpRequestStore,
  } = useHttpRequestStore();
  const { environment, setHttpStore, response: tResponse, testResult: tResult } = useHttpStore();
  const r = {
    name,
    method,
    endpoint,
    body,
    headers,
    params,
    preRequestScript,
    testScript,
    v,
    auth,
  };
  const { t } = useTranslation();

  const menu: MenuProps['items'] = [
    {
      label: 'Send Compare',
      key: '1',
      disabled: true,
    },
  ];

  function checkRequestParams(requestParams: any) {
    const { body } = requestParams;
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

  const handleRequest = ({ type }: any) => {
    if (checkRequestParams(r).error) {
      message.error(checkRequestParams(r).msg);
      return;
    }

    const urlPretreatment = (url: string) => {
      const editorValueMatch = url.match(/\{\{(.+?)\}\}/g) || [''];
      let replaceVar = editorValueMatch[0];
      const env = environment?.variables || [];
      for (let i = 0; i < env.length; i++) {
        if (env[i].key === editorValueMatch[0].replace('{{', '').replace('}}', '')) {
          replaceVar = env[i].value;
        }
      }
      return url.replace(editorValueMatch[0], replaceVar);
    };

    onSend({
      ...r,
      endpoint: urlPretreatment(r.endpoint),
    }).then((res) => {
      const { response, testResult } = res;
      console.log(response, 'response');
      setHttpStore((state) => {
        if (response.type === 'success') {
          state.response = {
            type: 'success',
            headers: response.headers,
            body: response.body,
            statusCode: response.statusCode,
            meta: {
              responseSize: response.meta.responseSize, // in bytes
              responseDuration: response.meta.responseDuration, // in millis
            },
          };
          state.testResult = testResult;
        }
      });
    });
  };
  return (
    <div
      css={css`
        padding: 16px;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        `}
      >
        {breadcrumb}
        <div>
          <Button
            onClick={() => {
              onSave({
                ...r,
              });
            }}
          >
            {t('action.save')}
          </Button>
        </div>
      </div>
      <HeaderWrapper>
        <Select
          value={method}
          options={methods.map((i) => ({ value: i, lable: i }))}
          onChange={(value) => {
            setHttpRequestStore((state) => {
              state.method = value;
            });
          }}
        />
        <SmartEnvInput
          value={endpoint}
          onChange={(value) => {
            setHttpRequestStore((state) => {
              state.endpoint = value;
            });
          }}
        ></SmartEnvInput>
        <div
          css={css`
            margin: 0 0px 0 14px;
          `}
        >
          <Dropdown.Button
            type='primary'
            menu={{
              items: menu,
              onClick: function (e) {
                console.log('click', e);
              },
            }}
            icon={<DownOutlined />}
            onClick={() => handleRequest({ type: null })}
          >
            {t('action.send')}
          </Dropdown.Button>
        </div>
      </HeaderWrapper>
    </div>
  );
};

export default HttpRequest;
