import React, { createContext, Dispatch, FC, PropsWithChildren, useEffect } from 'react';
import { useImmer } from 'use-immer';

import { isClient } from '../constant';
import { sendRequest } from '../helpers';
import { useArexRequestProps } from '../hooks';
import {
  ArexEnvironment,
  ArexResponse,
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
      formData: [],
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
  request: () => Promise<ArexResponse | void>;
}>({ store: defaultState, dispatch: () => {}, request: () => Promise.resolve() });

const RequestStoreProvider: FC<PropsWithChildren> = (props) => {
  const { data, environmentProps } = useArexRequestProps();
  const [store, dispatch] = useImmer(defaultState);
  const { onBeforeRequest = (request: ArexRESTRequest) => request, onRequest } =
    useArexRequestProps();

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

  const request = async (): Promise<ArexResponse | void> => {
    const ready = isClient || window.__AREX_EXTENSION_INSTALLED__;

    dispatch((state) => {
      state.response = {
        type: ready ? 'loading' : 'EXTENSION_NOT_INSTALLED',
        headers: undefined,
      };
    });

    if (!ready) return;

    return sendRequest(onBeforeRequest(store.request), store.environment)
      .then((res) => {
        onRequest?.(null, { request: store.request, environment: store.environment }, res);
        dispatch((state) => {
          state.response = res.response;
          state.consoles = res.consoles;
          state.visualizer = res.visualizer;
          state.testResult = res.testResult;
        });
        return res;
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
