import React, { createContext, Dispatch, FC, PropsWithChildren, useEffect } from 'react';
import { useImmer } from 'use-immer';

import { sendRequest } from '../helpers';
import { useArexRequestProps } from '../hooks';
import {
  ArexEnvironment,
  ArexRESTRequest,
  ArexRESTResponse,
  ArexTestResult,
  ArexVisualizer,
} from '../types';

export interface RequestStore {
  request: ArexRESTRequest;
  edited?: boolean;
  environmentId?: string;
  environment?: ArexEnvironment;
  response?: ArexRESTResponse;
  testResult?: ArexTestResult[];
  consoles?: any[];
  visualizer?: ArexVisualizer;
}

const defaultState: RequestStore = {
  request: {
    id: '',
    preRequestScript: '',
    v: '',
    headers: [],
    name: '',
    body: {
      contentType: 'application/json',
      body: '',
    },
    auth: {
      authActive: false,
      authType: 'none',
    },
    testScript: '',
    endpoint: '',
    method: '',
    params: [],
    inherited: false,
    inheritedEndpoint: '',
    inheritedMethod: '',
    description: '',
    parentPath: [],
  },
  edited: false,
  response: undefined,
  consoles: [],
  environment: undefined,
  testResult: undefined,
  visualizer: {
    error: null,
    data: null,
    processedTemplate: '',
  },
};

export const RequestStoreContext = createContext<{
  store: RequestStore;
  dispatch: Dispatch<(state: RequestStore) => void>;
  request: () => void;
}>({ store: defaultState, dispatch: () => {}, request: () => {} });

const RequestStoreProvider: FC<PropsWithChildren> = (props) => {
  const { data, environmentProps } = useArexRequestProps();
  const [store, dispatch] = useImmer(defaultState);

  const { onBeforeRequest = (request: ArexRESTRequest) => request, onRequest } =
    useArexRequestProps();

  const request = async () => {
    dispatch((state) => {
      state.response = {
        type: window.__AREX_EXTENSION_INSTALLED__ ? 'loading' : 'EXTENSION_NOT_INSTALLED',
        headers: undefined,
      };
    });

    if (!window.__AREX_EXTENSION_INSTALLED__) return;

    sendRequest(onBeforeRequest(store.request), store.environment)
      .then((res) => {
        onRequest?.(null, { request: store.request, environment: store.environment }, res);
        dispatch((state) => {
          state.response = res.response;
          state.consoles = res.consoles;
          state.visualizer = res.visualizer;
          state.testResult = res.testResult;
        });
      })
      .catch((err) => {
        onRequest?.(err, { request: store.request, environment: store.environment }, null);
        dispatch((state) => {
          state.response = {
            type: err.code,
            error: err,
          };
        });
      });
  };
  useEffect(() => {
    data &&
      dispatch((state) => {
        state.request = data;
      });
  }, [data]);

  useEffect(() => {
    dispatch((state) => {
      state.environment = environmentProps?.options?.find(
        (env) => env.id === environmentProps?.value,
      );
    });
  }, [environmentProps]);

  return (
    <RequestStoreContext.Provider
      value={{
        store,
        dispatch,
        request,
      }}
    >
      {props.children}
    </RequestStoreContext.Provider>
  );
};

export default RequestStoreProvider;
