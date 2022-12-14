import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import produce, { Draft } from 'immer';
import {
  createContext,
  Dispatch,
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
} from 'react';

import HttpRequest from './components/http/Request';
import HttpRequestOptions from './components/http/RequestOptions';
import HttpResponse from './components/http/Response';
import TestResult from './components/http/TestResult';
import { Environment } from './data/environment';
import { HoppRESTRequest } from './data/rest';
import { defaultState } from './defaultState';
import { HoppRESTResponse } from './helpers/types/HoppRESTResponse';
import { HoppTestResult } from './helpers/types/HoppTestResult';

export interface State {
  request: HoppRESTRequest;
  response: HoppRESTResponse | null;
  testResult: HoppTestResult | null;
  environment: Environment;
  theme: 'dark' | 'light';
}

export type HttpImperativeHandle = {
  getRequestValue: () => State['request'];
};
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
  renderResponse?: boolean;
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

const Http = forwardRef<HttpImperativeHandle, HttpProps>(
  (
    { value, onSend, environment, onSave, theme, breadcrumb, config, renderResponse = true },
    ref,
  ) => {
    const [store, dispatch] = useReducer(produce(reducer), defaultState);

    useImperativeHandle(ref, () => {
      return {
        getRequestValue: () => store.request,
      };
    });

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
          <Allotment.Pane preferredSize={renderResponse ? 360 : '100%'}>
            <div
              css={css`
                height: 100%;
                display: flex;
                flex-direction: column;
              `}
            >
              <HttpRequest breadcrumb={breadcrumb} onSave={onSave} onSend={onSend}></HttpRequest>
              <HttpRequestOptions config={config} />
            </div>
          </Allotment.Pane>
          {renderResponse ? (
            <Allotment.Pane>
              <HttpResponse />
            </Allotment.Pane>
          ) : null}
        </Allotment>
      </HttpContext.Provider>
    );
  },
);

export default Http;

export { TestResult };
