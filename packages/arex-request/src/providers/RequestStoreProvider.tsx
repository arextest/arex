import React, { createContext, Dispatch, FC, PropsWithChildren, useEffect } from 'react';
import { useImmer } from 'use-immer';

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
}>({ store: defaultState, dispatch: () => {} });

const RequestStoreProvider: FC<PropsWithChildren> = (props) => {
  const { data, environmentProps } = useArexRequestProps();
  const [store, dispatch] = useImmer(defaultState);

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
      }}
    >
      {props.children}
    </RequestStoreContext.Provider>
  );
};

export default RequestStoreProvider;
