import React, { createContext, Dispatch, FC, PropsWithChildren, useEffect } from 'react';
import { useImmer } from 'use-immer';

import { ArexEnvironment, ArexRESTRequest, ArexRESTResponse, ArexTestResult } from '../types';

export interface RequestStore {
  request: ArexRESTRequest;
  edited?: boolean;
  environment?: ArexEnvironment;
  response?: ArexRESTResponse;
  testResult?: ArexTestResult;
  consoles?: any[];
  visualizer?: {
    data: any;
    error: null | string;
    processedTemplate: string;
  };
}

const defaultState: RequestStore = {
  request: {
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
    description: 'miaoshu',
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

const RequestStoreProvider: FC<PropsWithChildren<{ request?: ArexRESTRequest }>> = (props) => {
  const [store, dispatch] = useImmer(defaultState);

  useEffect(() => {
    props.request &&
      dispatch((state) => {
        state.request = props.request!;
      });
  }, [props.request]);

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
