import 'allotment/dist/style.css';

import { css } from '@emotion/react';
import { useMount } from 'ahooks';
import { Allotment } from 'allotment';
import _ from 'lodash-es';
import { createContext, FC, useEffect, useReducer } from 'react';

import HttpRequest from './components/http/Request';
import HttpRequestOptions from './components/http/RequestOptions';
import HttpResponse from './components/http/Response';
import TestResult from './components/http/TestResult';
import { defaultState, globalDefaultState } from './default';

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
  cRef: any;
}

interface HttpProviderProps {
  children: any;
  collectionTreeData: any;
  environment: any;
}

const HttpProvider: FC<HttpProviderProps> = ({
  children = null,
  collectionTreeData = [],
  environment,
}) => {
  const [store, dispatch] = useReducer(reducer, globalDefaultState);

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
  return <GlobalContext.Provider value={{ store, dispatch }}>{children}</GlobalContext.Provider>;
};

const Http: FC<HttpProps> = ({
  currentRequestId,
  onEdit,
  onSend,
  onSendCompare,
  cRef,
  requestaxios,
}) => {
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

  return (
    <HttpContext.Provider value={{ store, dispatch }}>
      {store.request.method !== '' ? (
        <Allotment
          css={css`
            height: 100%;
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
              <HttpRequestOptions requestaxios={requestaxios}></HttpRequestOptions>
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <HttpResponse requestaxios={requestaxios} />
          </Allotment.Pane>
        </Allotment>
      ) : null}
    </HttpContext.Provider>
  );
};

export default Http;

export { HttpProvider };

export { TestResult };
