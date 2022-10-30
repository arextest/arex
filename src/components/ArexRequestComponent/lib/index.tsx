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
import TestResult from './components/http/TestResult';
import { defaultState, globalDefaultState, LocaleEnum, ThemeEnum } from './default';
import cn from './locales/cn.json';
import en from './locales/en.json';
import { themeMap } from './theme';

export type LocaleInterface = Record<LocaleEnum, { type: string; locale: any }>;
export type ThemeInterface = Record<ThemeEnum, { type: string; locale: any }>;

const localeMap: LocaleInterface = {
  cn: {
    type: 'cn',
    locale: cn,
  },
  en: {
    type: 'en',
    locale: en,
  },
};

export const HttpContext = createContext({});
export const GlobalContext = createContext({});

function reducer(state = defaultState, action: { type: string; payload: any }) {
  const cloneState = JSON.parse(JSON.stringify(state));
  _.set(cloneState, action.type, action.payload);
  return cloneState;
}

interface HttpProps {
  currentRequestId: string;
  onEdit: ({ type, payload }: any) => Promise<any>;
  onSend: () => any;
  // ---
  requestExtraTabItems: any;
  requestExtraData: any;
  cRef: any;
}

interface HttpProviderProps {
  children: any;
  theme: ThemeEnum;
  locale: LocaleEnum;
  collectionTreeData: any;
  environment: any;
}

const HttpProvider: FC<HttpProviderProps> = ({
  children = null,
  theme,
  locale = LocaleEnum.en,
  collectionTreeData = [],
  environment,
}) => {
  const [store, dispatch] = useReducer(reducer, globalDefaultState);
  useEffect(() => {
    dispatch({
      type: 'locale',
      payload: localeMap[locale],
    });
  }, [locale]);

  useEffect(() => {
    dispatch({
      type: 'theme',
      payload: themeMap[theme],
    });
  }, [theme]);

  useEffect(() => {
    dispatch({
      type: 'environment',
      payload: environment,
    });
  }, [environment]);

  useEffect(() => {
    dispatch({
      type: 'collectionTreeData',
      payload: collectionTreeData,
    });
  }, [collectionTreeData]);
  // console.log({theme})
  return <GlobalContext.Provider value={{ store, dispatch }}>{children}</GlobalContext.Provider>;
};

// TODO
/*
1. ArexRequestComponent =》 HttpRequest
2. 核心props 全局props/locale、theme、collectionTreeData？，内部props/currentRequestId、onEdit、onSend,
3. 字典例如 onSend以后触发的函数名称，返回值里面需要包含{testResult,response}
4. 导出的方法
* */
const Http: FC<HttpProps> = ({ currentRequestId, onEdit, onSend, onSendCompare, cRef }) => {
  const [store, dispatch] = useReducer(reducer, {
    ...defaultState,
    request: {
      ...defaultState.request,
    },
  });

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
  // 需要将暴露的接口返回出去
  useImperativeHandle(cRef, () => {
    return {
      func: func,
      setValue(value: any) {
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
      {store.request.method !== '' ? (
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
                currentRequestId={currentRequestId}
                onEdit={onEdit}
                onSend={onSend}
                onSendCompare={onSendCompare}
              ></HttpRequest>
              <HttpRequestOptions></HttpRequestOptions>
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

export default Http;

export { HttpProvider };

export { TestResult };
