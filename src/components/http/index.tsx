import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import { Button, TabPaneProps } from 'antd';
import produce, { Draft } from 'immer';
import React, {
  createContext,
  Dispatch,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
} from 'react';

import { Request, RequestTabs, ResponseTabs, TestResult } from './components/http';
import { LensesHeadersRendererEntryProps } from './components/lenses/HeadersRendererEntry';
import { Environment } from './data/environment';
import { HoppRESTRequest } from './data/rest';
import { defaultState } from './defaultState';
import { ExtraTabs } from './extra';
import { HoppRESTResponse } from './helpers/types/HoppRESTResponse';
import { HoppTestResult } from './helpers/types/HoppTestResult';

export interface State {
  request: HoppRESTRequest;
  response: HoppRESTResponse | null;
  testResult: HoppTestResult | null;
  environment: Environment;
  theme: 'dark' | 'light';
  compareResult: {
    logs: any[];
    responses: any[];
  };
  mode: 'compare' | 'normal';
  compareLoading: boolean;
}

export type HttpRef = {
  getRequestValue: () => State['request'];
  resetResponse: () => void;
  forceReRendering: () => void;
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
  onPreSend: (request: HoppRESTRequest) => Promise<{
    prTestResultEnvs: { key: string; value: string }[];
    prTestResultRequest: { params: any[]; header: any[] };
  }>;
  onSave: (r: HoppRESTRequest, rp?: HoppRESTResponse) => void;
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
      onPreSend,
      onSendCompare,
      defaultDisplayResponse = false,
      requestPanePreferredSize = 360,
    },
    ref,
  ) => {
    const [store, dispatch] = useReducer(produce(reducer), defaultState);

    useImperativeHandle(ref, () => ({
      getRequestValue: () => store.request,
      resetResponse: () => {
        dispatch((state) => {
          if (defaultDisplayResponse) {
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
          } else {
            state.response = null;
          }
        });
      },
      forceReRendering() {
        dispatch((state) => {
          // @ts-ignore
          state.request.method = undefined;
        });
        setTimeout(() => {
          dispatch((state) => {
            state.request.method = 'GET';
          });
        }, 10);
      },
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
          state.request.method = value.method || 'GET';
          state.request.endpoint = value.endpoint || '';
          state.request.compareMethod = value.compareMethod || 'GET';
          state.request.compareEndpoint = value.compareEndpoint || '';
          state.request.parentValue = value.parentValue;
          state.request.body = value.body || {
            contentType: 'application/json',
            body: '',
          };
          state.request.headers = value.headers || [];
          state.request.params = value.params || [];
          state.request.testScripts = value.testScripts || [];
          state.request.preRequestScripts = value.preRequestScripts || [];
          state.request.parentPreRequestScripts = value.parentPreRequestScripts || [];
          state.request.description = value.description || '';
          state.request.inherited = value.inherited;
          // 默认加上{Content-Type:application/json}
          if (!state.request.headers.find((head) => head.key === 'Content-Type')) {
            state.request.headers.unshift({
              key: 'Content-Type',
              value: 'application/json',
              active: true,
            });
          }
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
                  <Request
                    id={id}
                    labelIds={value?.labelIds}
                    nodePath={nodePath}
                    nodeType={nodeType}
                    onSave={onSave}
                    onSend={onSend}
                    onSendCompare={onSendCompare}
                    onPreSend={onPreSend}
                  />
                  <RequestTabs config={config?.requestTabs} />
                </>
              )}
            </div>
          </Allotment.Pane>

          {renderResponse && (
            <Allotment.Pane>
              {store.mode === 'compare' ? (
                <ExtraTabs.ResponseTabs.CompareResult
                  compareResult={store.compareResult}
                  loading={store.compareLoading}
                />
              ) : (
                <ResponseTabs onPin={onPin} config={config?.responseTabs} />
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
