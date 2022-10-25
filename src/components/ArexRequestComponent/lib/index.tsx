import 'allotment/dist/style.css';
import 'antd/dist/antd.css';

import { css } from '@emotion/react';
import { useMount } from 'ahooks';
import { Allotment } from 'allotment';
import _ from 'lodash-es';
import { createContext, FC, useEffect, useImperativeHandle, useReducer, useState } from 'react';

import HttpRequest from './components/http/Request';
import HttpRequestOptions from './components/http/RequestOptions';
import HttpResponse from './components/http/Response';
import cn from './locales/cn.json';
import en from './locales/en.json';

const localeObj = {
  en,
  cn,
};

export const HttpContext = createContext({});

const defaultState = {
  request: {
    preRequestScript: '',
    v: '',
    headers: [],
    name: '',
    body: {
      contentType: 'application/json',
      body: '',
    },
    testScript: '',
    method: '',
    auth: {
      authURL: 'http://petstore.swagger.io/api/oauth/dialog',
      oidcDiscoveryURL: '',
      accessTokenURL: '',
      clientID: '',
      scope: 'write:pets read:pets',
      token: '',
      authType: 'oauth-2',
      authActive: true,
    },
    endpoint: '',
    params: [],
  },
  response: {
    type: 'success',
    headers: [],
    statusCode: 200,
    body: '',
    meta: {
      responseSize: 0,
      responseDuration: 1,
    },
    error: {
      name: '',
      message: '',
      stack: '',
    },
  },
  testResult: {},
  locale: en,
  theme: 'dark',
};

function reducer(state = defaultState, action) {
  const clonestate = JSON.parse(JSON.stringify(state));
  _.set(clonestate, action.type, action.payload);
  return clonestate;
}

interface ArexRequestComponentProps {
  collectionTreeData: any[];
  currentRequestId: string;
  envData: [];
  currentEnvId: string;
  locale: string;
  theme: string;
  onEdit: ({ type, payload }) => any;
  requestExtraTabItems: any;
  requestExtraData: any;
  cRef: any;
}

const ArexRequestComponent: FC<ArexRequestComponentProps> = ({
  locale = 'en',
  theme = 'light',
  collectionTreeData,
  currentRequestId,
  envData,
  currentEnvId,
  onEdit,
  requestExtraTabItems,
  cRef,
  requestExtraData,
}) => {
  const [store, dispatch] = useReducer(reducer, {
    ...defaultState,
    request: {
      ...defaultState.request,
      ...requestExtraTabItems[0].data,
    },
  }); //创建reducer
  const [data, setData] = useState({});
  useEffect(() => {
    dispatch({
      type: 'locale',
      payload: localeObj[locale],
    });
  }, [locale]);

  useMount(() => {
    onEdit({
      type: 'retrieve',
      payload: {
        requestId: currentRequestId,
      },
    }).then((res) => {
      dispatch({
        type: 'request',
        payload: res,
      });
    });
  });
  //用useImperativeHandle暴露一些外部ref能访问的属性
  useImperativeHandle(cRef, () => {
    // 需要将暴露的接口返回出去
    return {
      func: func,
      setValue(value) {
        dispatch({
          type: 'request.mock',
          payload: value,
        });
      },
    };
  });

  function func() {
    return store.request;
  }
  return (
    <HttpContext.Provider value={{ store, dispatch }}>
      {store.request.endpoint !== '' ? (
        <Allotment
          css={css`
            height: calc(100vh - 118px);
          `}
          vertical={true}
        >
          <Allotment.Pane preferredSize={400}>
            <div
              css={css`
                height: 100%;
                display: flex;
                flex-direction: column;
              `}
            >
              <HttpRequest
                collectionTreeData={collectionTreeData}
                currentRequestId={currentRequestId}
                onEdit={onEdit}
              ></HttpRequest>
              <HttpRequestOptions
                requestExtraTabItems={requestExtraTabItems}
                data={data}
                theme={theme}
              ></HttpRequestOptions>
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <HttpResponse />
          </Allotment.Pane>
        </Allotment>
      ) : null}
    </HttpContext.Provider>
  );
};

export default ArexRequestComponent;
