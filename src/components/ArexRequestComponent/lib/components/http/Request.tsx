import { DownOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breadcrumb, Button, Dropdown, Input, Menu, MenuProps, message, Select, Space } from 'antd';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { treeFind, treeFindPath } from '../../helpers/collection/util';
import { getValueByPath } from '../../helpers/utils/locale';
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

const HttpRequest = ({ currentRequestId, onEdit, onSend, onSendCompare }) => {
  const { store, dispatch } = useContext(HttpContext);
  const { dispatch: globalDispatch, store: globalStore } = useContext(GlobalContext);
  console.log(globalStore.locale, 'globalStore.locale');
  const t = (key) => getValueByPath(globalStore.locale.locale, key);

  const onMenuClick: MenuProps['onClick'] = (e) => {
    handleRequest({ type: 'compare' });
  };

  const menu = (
    <Menu
      onClick={onMenuClick}
      items={[
        {
          key: '1',
          label: 'Send Compare',
        },
      ]}
    />
  );

  const handleRequest = ({ type }) => {
    const urlPretreatment = (url: string) => {
      // 正则匹配{{}}
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

    console.log(
      store.request.endpoint,
      'store.request.endpoint',
      urlPretreatment(store.request.endpoint),
    );
    // return
    dispatch({
      type: 'response.type',
      payload: 'loading',
    });

    const start = new Date().getTime();

    console.log(store.request);

    if (type === 'compare') {
      console.log('company？');
      onSendCompare({
        request: {
          ...store.request,
          endpoint: urlPretreatment(store.request.endpoint),
        },
      }).then((agentAxiosCompareResponse: any) => {
        dispatch({
          type: 'response.type',
          payload: 'success',
        });

        dispatch({
          type: 'response.body',
          payload: JSON.stringify(agentAxiosCompareResponse.response.data),
        });

        dispatch({
          type: 'compareResponse.type',
          payload: 'success',
        });

        dispatch({
          type: 'compareResponse.body',
          payload: JSON.stringify(agentAxiosCompareResponse.compareResponse.data),
        });
      });
    } else {
      console.log('norm');
      // 还原null
      dispatch({
        type: 'compareResponse.type',
        payload: 'null',
      });
      onSend({
        request: {
          ...store.request,
          endpoint: urlPretreatment(store.request.endpoint),
        },
      }).then((agentAxiosAndTest: any) => {
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
        `}
      >
        {/*{*/}
        {/*  JSON.stringify(treeFindPath(collectionTreeData,(node)=>node.key === currentRequestId))*/}
        {/*}*/}
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
        {/*<Button type='primary' onClick={handleRequest}>*/}
        {/*  {t('action.send')}*/}
        {/*</Button>*/}

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
