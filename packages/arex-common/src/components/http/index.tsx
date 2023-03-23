import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import produce, { Draft } from 'immer';
import { createContext, Dispatch, FC, useEffect, useReducer } from 'react';

import HttpRequest from './components/http/Request';
import HttpRequestOptions from './components/http/RequestOptions';
import HttpResponse from './components/http/Response';
import TestResult from './components/http/TestResult';
import { Environment } from './data/environment';
import { HoppRESTRequest } from './data/rest';
import { defaultState } from './defaultState';
import { HoppRESTResponse } from './helpers/types/HoppRESTResponse';
import { HoppTestResult } from './helpers/types/HoppTestResult';
import { checkWhetherTwoObjectsAreEqual } from './helpers/utils/checkWhetherTwoObjectsAreEqual';

export interface State {
  request: HoppRESTRequest;
  defaultRequest: HoppRESTRequest;
  edited: boolean;
  response: HoppRESTResponse | null;
  ewaiResult: any;
  testResult: HoppTestResult | null;
  environment: Environment;
  theme: 'dark' | 'light';
}

export interface HttpProps {
  environment: Environment;
  theme: 'dark' | 'light';
  value: HoppRESTRequest | null;
  breadcrumb: any;
  onSend: (
    r: HoppRESTRequest,
  ) => Promise<{ response: HoppRESTResponse; testResult: HoppTestResult }>;
  onSave: (r: HoppRESTRequest) => void;
  config: any;
  onChangeEditState: (r: boolean) => void;
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

const Http: FC<HttpProps> = ({
  value,
  onSend,
  environment,
  onSave,
  theme,
  breadcrumb,
  onChangeEditState,
}) => {
  const [store, dispatch] = useReducer(produce(reducer), defaultState);

  useEffect(() => {
    dispatch((state) => {
      if (value) {
        state.request = value;
        if (!state.request.headers.find((head) => head.key === 'Content-Type')) {
          state.request.headers.push({
            key: 'Content-Type',
            value: 'application/json',
            active: true,
          });
        }

        state.defaultRequest = value;
        if (!state.defaultRequest.headers.find((head) => head.key === 'Content-Type')) {
          state.defaultRequest.headers.push({
            key: 'Content-Type',
            value: 'application/json',
            active: true,
          });
        }
      }
    });
  }, [value]);

  useEffect(() => {
    if (store.request.method !== '' && store.defaultRequest.method !== '') {
      dispatch((state) => {
        state.edited = checkWhetherTwoObjectsAreEqual(store.request, store.defaultRequest);
      });

      onChangeEditState(checkWhetherTwoObjectsAreEqual(store.request, store.defaultRequest));
    }
  }, [store.request, store.defaultRequest]);

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
          .ant-tabs-content {
            height: 100%;

            .ant-tabs-tabpane {
              height: inherit;
              //padding: 0 16px;
              overflow: auto;
            }
          }
        `}
        vertical={true}
      >
        <Allotment.Pane preferredSize={360}>
          {store.request.method !== '' ? (
            <div
              css={css`
                height: 100%;
                display: flex;
                flex-direction: column;
              `}
            >
              <HttpRequest breadcrumb={breadcrumb} onSave={onSave} onSend={onSend}></HttpRequest>
              <HttpRequestOptions />
            </div>
          ) : null}
        </Allotment.Pane>
        <Allotment.Pane>
          <HttpResponse />
        </Allotment.Pane>
      </Allotment>
    </HttpContext.Provider>
  );
};

export default Http;

export { TestResult };
