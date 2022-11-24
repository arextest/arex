// @ts-nocheck
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

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
enum SEND_MENU_TYPE {
  'normal' = 'normal',
  'compare' = 'compare',
  'arexRecord' = 'arexRecord',
}

const HttpRequest = ({ currentRequestId, onEdit, onSend, onSendCompare }) => {
  const { store, dispatch } = useContext(HttpContext);
  const { dispatch: globalDispatch, store: globalStore } = useContext(GlobalContext);
  const t = (key) => getValueByPath(globalStore.locale.locale, key);

  const menu: MenuProps = {
    onClick: (e) => {
      handleRequest(e.key);
    },
    items: [
      {
        key: SEND_MENU_TYPE.compare,
        label: 'Send Compare',
      },
      {
        key: SEND_MENU_TYPE.arexRecord,
        label: 'Send Arex Record',
      },
    ],
  };

  const handleRequest = (type) => {
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

    dispatch({
      type: 'response.type',
      payload: 'loading',
    });

    const start = new Date().getTime();

    if (SEND_MENU_TYPE.normal === type || SEND_MENU_TYPE.arexRecord === type) {
      dispatch({
        type: 'compareResponse.type',
        payload: 'null',
      });

      const requestParams = { ...store.request, endpoint: urlPretreatment(store.request.endpoint) };
      if (type === SEND_MENU_TYPE.arexRecord) {
        requestParams.headers.push({
          key: 'arex-record-id',
          value: currentRequestId,
          active: true,
        });
      }

      onSend({
        request: requestParams,
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
        console.log({ type });
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
    } else if (type === SEND_MENU_TYPE.compare) {
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

        <Button
          size={'small'}
          style={{ marginBottom: '8px' }}
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

      <HeaderWrapper>
        <Select
          value={store.request.method}
          options={METHODS.map((i) => ({ value: i, lable: i }))}
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
        />

        <div style={{ marginLeft: '12px' }}>
          <Dropdown.Button
            type='primary'
            onClick={() => handleRequest(SEND_MENU_TYPE.normal)}
            menu={menu}
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
