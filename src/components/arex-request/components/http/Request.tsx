import { DownOutlined } from '@ant-design/icons';
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Breadcrumb, Button, Dropdown, Menu, MenuProps, Select } from 'antd';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { treeFindPath } from '../../helpers/collection/util';
import { GlobalContext, HttpContext } from '../../index';
import SmartEnvInput from '../smart/EnvInput';

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

const HttpRequest = ({ currentRequestId, onEdit, onSend }) => {
  const { store,dispatch } = useContext(HttpContext);
  const { store: globalStore } = useContext(GlobalContext);

  const { t } = useTranslation();
  const onMenuClick: MenuProps['onClick'] = (e) => {
  };

  const menu = (
    <Menu
      onClick={onMenuClick}
      items={[
        {
          key: '1',
          label: 'Send C',
        },
      ]}
    />
  );

  const handleRequest = ({ type }) => {
    console.log({type})
    const urlPretreatment = (url: string) => {
      const editorValueMatch = url.match(/\{\{(.+?)\}\}/g) || [''];
      let replaceVar = editorValueMatch[0];
      const env = globalStore.environment?.keyValues || [];
      for (let i = 0; i < env.length; i++) {
        if (env[i].key === editorValueMatch[0].replace('{{', '').replace('}}', '')) {
          replaceVar = env[i].value;
        }
      }

      return url.replace(editorValueMatch[0], replaceVar);
    };
    dispatch({
      type: 'response.type',
      payload: 'loading',
    });

    const start = new Date().getTime();

    if (type === 'compare') {
    } else {
      onSend({
        request: {
          ...store.request,
          endpoint: urlPretreatment(store.request.endpoint),
        },
      }).then((agentAxiosAndTest: any) => {
        console.log(agentAxiosAndTest,'agentAxiosAndTest')
        dispatch({
          type: 'response.type',
          payload: 'success',
        });

        dispatch({
          type: 'response.body',
          payload: JSON.stringify(agentAxiosAndTest.response.data),
        });

        dispatch({
          type: 'testResult',
          payload: agentAxiosAndTest.testResult,
        });
        dispatch({
          type: 'response.headers',
          payload: agentAxiosAndTest.response.headers,
        });

        dispatch({
          type: 'response.meta',
          payload: {
            responseSize: JSON.stringify(agentAxiosAndTest.response.data).length,
            responseDuration: new Date().getTime() - start,
          },
        });

        dispatch({
          type: 'response.statusCode',
          payload: agentAxiosAndTest.response.status,
        });
      });
    }
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
        <Breadcrumb style={{ paddingBottom: '14px' }}>
          {treeFindPath(
            globalStore.collectionTreeData,
            (node) => node.key === currentRequestId,
          ).map((i, index) => (
            <Breadcrumb.Item key={index}>{i.title}</Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <div>
          <Button
            onClick={() => {
              onEdit({
                type: 'update',
                payload: {
                  ...store.request,
                },
              });
            }}
          >
            {t('action.save')}
          </Button>
        </div>
      </div>
      <HeaderWrapper>
        <Select
          value={store.request.method}
          options={methods.map((i) => ({ value: i, lable: i }))}
          onChange={(value) => {
            dispatch({
              type: 'request.method',
              payload: value,
            });
          }}
        />
        <SmartEnvInput
          value={store.request.endpoint}
          onChange={() => {
            // console.log('http://127.0.0.1:5173/arex-request/');
          }}
        ></SmartEnvInput>
        <div
          css={css`
            margin: 0 0px 0 14px;
          `}
        >
          <Dropdown.Button
            type='primary'
            onClick={() => handleRequest({ type: null })}
            overlay={menu}
            icon={<DownOutlined />}
          >
            {t('action.send')}
          </Dropdown.Button>
        </div>
      </HeaderWrapper>
    </div>
  );
};

export default HttpRequest;
