import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import { TabPaneProps } from 'antd';
import produce, { Draft } from 'immer';
import React, {
  createContext,
  Dispatch,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
} from 'react';

import HttpRequest from './components/http/Request';
import HttpRequestOptions from './components/http/RequestOptions';
import HttpResponse from './components/http/Response';
import TestResult from './components/http/TestResult';
import { LensesHeadersRendererEntryProps } from './components/lenses/HeadersRendererEntry';
import { Environment } from './data/environment';
import { HoppRESTRequest } from './data/rest';
import { defaultState } from './defaultState';
import ExtraResponseTabItemCompareResult from './extra/ExtraResponseTabItemCompareResult';
import { HoppRESTResponse } from './helpers/types/HoppRESTResponse';
import { HoppTestResult } from './helpers/types/HoppTestResult';

export interface State {
  request: HoppRESTRequest;
  response: HoppRESTResponse | null;
  testResult: HoppTestResult | null;
  environment: Environment;
  theme: 'dark' | 'light';
  compareResult: any[];
  mode: 'compare' | 'normal';
  compareLoading: boolean;
}

export type HttpRef = {
  getRequestValue: () => State['request'];
};

export interface Tab extends Omit<TabPaneProps, 'tab'> {
  key: string;
  label: React.ReactNode;
  hidden?: boolean;
}

export type TabConfig = {
  extra?: Tab[];
  filter?: (key: string) => boolean;
};

export type HttpConfig = {
  requestTabs?: TabConfig;
  responseTabs?: TabConfig;
};

export interface HttpProps {
  id: string;
  environment: Environment;
  theme: 'dark' | 'light';
  value?: HoppRESTRequest | null;
  nodeType: number;
  nodePath: string[];
  onSend: (
    request: HoppRESTRequest,
  ) => Promise<{ response: HoppRESTResponse; testResult: HoppTestResult }>;
  onSave: (r: HoppRESTRequest) => void;
  onSendCompare: (r: HoppRESTRequest) => Promise<any>;
  config?: HttpConfig;
  renderResponse?: boolean;
  onPin: LensesHeadersRendererEntryProps['onPin'];
  defaultDisplayResponse?: boolean;
  requestPanePreferredSize?: number;
}

export const HttpContext = createContext<
  { store: State } & { dispatch: Dispatch<(state: State) => void> }
>({
  store: defaultState,
  dispatch: () => undefined,
});
function reducer(draft: Draft<State>, action: (state: State) => void) {
  return action(draft);
}

const Http = forwardRef<HttpRef, HttpProps>(
  (
    {
      id,
      value,
      nodeType,
      nodePath,
      environment,
      theme,
      config,
      renderResponse = true,
      onPin,
      onSend,
      onSave,
      onSendCompare,
      defaultDisplayResponse = false,
      requestPanePreferredSize = 360,
    },
    ref,
  ) => {
    const [store, dispatch] = useReducer(produce(reducer), defaultState);

    useImperativeHandle(ref, () => ({
      getRequestValue: () => store.request,
    }));

    useEffect(() => {
      // 控制初始状态下是否展示response
      if (defaultDisplayResponse) {
        dispatch((state) => {
          state.response = {
            type: 'empty',
            headers: [],
            body: '',
            statusCode: 0,
            meta: {
              responseSize: 0,
              responseDuration: 0,
            },
          };
        });
      }
    }, [defaultDisplayResponse]);

    useEffect(() => {
      dispatch((state) => {
        if (value) {
          state.request = value;
        }
      });
    }, [value]);

    useEffect(() => {
      dispatch((state) => {
        state.theme = theme;
      });
    }, [theme]);

    useEffect(() => {
      dispatch((state) => {
        state.environment = environment;
      });
    }, [environment]);

    return (
      <HttpContext.Provider value={{ store, dispatch }}>
        <Allotment
          css={css`
            height: 100%;
          `}
          vertical={true}
        >
          <Allotment.Pane preferredSize={renderResponse ? requestPanePreferredSize : '100%'}>
            <div
              css={css`
                height: 100%;
                display: flex;
                flex-direction: column;
              `}
            >
              {store.request.method && (
                <>
                  <HttpRequest
                    id={id}
                    labelIds={value?.labelIds}
                    nodePath={nodePath}
                    nodeType={nodeType}
                    onSave={onSave}
                    onSend={onSend}
                    onSendCompare={onSendCompare}
                  />
                  <HttpRequestOptions config={config?.requestTabs} />
                </>
              )}
            </div>
          </Allotment.Pane>

          {renderResponse && (
            <Allotment.Pane>
              {store.mode === 'compare' ? (
                <ExtraResponseTabItemCompareResult theme={theme} responses={store.compareResult} />
              ) : (
                <HttpResponse onPin={onPin} config={config?.responseTabs} />
              )}
            </Allotment.Pane>
          )}
        </Allotment>
      </HttpContext.Provider>
    );
  },
);

export default Http;

export { TestResult };
