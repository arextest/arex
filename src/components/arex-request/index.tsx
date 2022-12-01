import { css } from '@emotion/react';
import { useMount } from 'ahooks';
import { Allotment } from 'allotment';
import _ from 'lodash-es';
import { createContext, FC, useEffect, useReducer } from 'react';

import HttpRequest from './components/http/Request';
import HttpRequestOptions from './components/http/RequestOptions';
import HttpResponse from './components/http/Response';
import TestResult from './components/http/TestResult';
import { defaultState } from './default';

export const HttpContext = createContext<any>({});

function reducer(state = defaultState, action: { type: string; payload: any }) {
  const cloneState = JSON.parse(JSON.stringify(state));
  _.set(cloneState, action.type, action.payload);
  return cloneState;
}

interface HttpProps {
  currentRequestId: string;
  onEdit: any;
  onSend: any;
  collectionTreeData: any;
  environment: any;
  darkMode: boolean;
}

const Http: FC<HttpProps> = ({
  currentRequestId,
  onEdit,
  onSend,
  collectionTreeData = [],
  environment,
  darkMode,
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
    }).then((res: any) => {
      dispatch({
        type: 'request',
        payload: res,
      });
    });
  });

  useEffect(() => {
    dispatch({
      type: 'environment',
      payload: environment,
    });
    dispatch({
      type: 'collectionTreeData',
      payload: collectionTreeData,
    });
    dispatch({
      type: 'darkMode',
      payload: darkMode,
    });
  }, [collectionTreeData, environment, darkMode]);

  return (
    <HttpContext.Provider value={{ store, dispatch }}>
      {store.request.method !== '' ? (
        <Allotment
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

export { TestResult };
