import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import { FC, useEffect } from 'react';

import HttpRequest from './components/http/Request';
import HttpRequestOptions from './components/http/RequestOptions';
import HttpResponse from './components/http/Response';
import TestResult from './components/http/TestResult';
import { Environment } from './data/environment';
import { HoppRESTRequest } from './data/rest';
import { HoppRESTResponse } from './helpers/types/HoppRESTResponse';
import { HoppTestResult } from './helpers/types/HoppTestResult';
import { useHttpRequestStore } from './store/useHttpRequestStore';
import { useHttpStore } from './store/useHttpStore';

interface HttpProps {
  environment: Environment;
  theme: 'dark' | 'light';
  value: HoppRESTRequest | undefined;
  breadcrumb: any;
  onSend: (
    r: HoppRESTRequest,
  ) => Promise<{ response: HoppRESTResponse; testResult: HoppTestResult }>;
  onSave: (r: HoppRESTRequest) => void;
  config: any;
}

const Http: FC<HttpProps> = ({ environment, theme, value, config, breadcrumb, onSend, onSave }) => {
  const { setHttpRequestStore } = useHttpRequestStore();
  const { setHttpStore } = useHttpStore();
  useEffect(() => {
    if (value) {
      setHttpRequestStore((state) => {
        state.method = value.method;
        state.endpoint = value.endpoint;
        state.body = value.body;
        state.params = value.params;
        state.headers = value.headers;
        state.testScript = value.testScript;
      });
    }
  }, [value]);
  useEffect(() => {
    setHttpStore((state) => {
      state.theme = theme;
    });
  }, [theme]);

  return (
    <div
      css={css`
        height: 100%;
      `}
    >
      {value ? (
        <Allotment vertical={true}>
          <Allotment.Pane preferredSize={400}>
            <div
              css={css`
                height: 100%;
                display: flex;
                flex-direction: column;
              `}
            >
              <HttpRequest breadcrumb={breadcrumb} onSend={onSend} onSave={onSave}></HttpRequest>
              <HttpRequestOptions config={config}></HttpRequestOptions>
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <HttpResponse />
          </Allotment.Pane>
        </Allotment>
      ) : null}
    </div>
  );
};

export default Http;

export { TestResult };
