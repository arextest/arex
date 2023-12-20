import { css } from '@arextest/arex-core';
import { Allotment } from 'allotment';
import { Divider, Spin, TabPaneProps } from 'antd';
import React, { forwardRef, useImperativeHandle, useMemo } from 'react';

import NavigationBar from './components/NavigationBar';
import Request, { RequestProps } from './components/Request';
import Response from './components/Response';
import { useArexRequestStore } from './hooks';
import { RequestPropsProvider, RequestStoreProvider } from './providers';
import { ArexRESTRequest } from './types';

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

export interface ArexRequestProps extends RequestProps {
  loading?: boolean;
  height?: string;
  data?: ArexRESTRequest;
  config?: HttpConfig;
}

export type RequestRef = {
  onSave: () => void;
  onSaveAs: () => void;
};

const ArexRequest = forwardRef<RequestRef, ArexRequestProps>((props, ref) => {
  const { loading = false, height } = props;
  const { store } = useArexRequestStore();

  useImperativeHandle(
    ref,
    () => ({
      onSave: () => props.onSave?.(store.request, store.response),
      onSaveAs: () => props.onSaveAs?.(),
    }),
    [props, store.request, store.response],
  );

  const AllotmentCSS = useMemo(
    () => css`
      height: 100%;
      .ant-tabs-content {
        height: 100%;
      }
      .ant-tabs-tabpane {
        height: inherit;
        overflow: auto;
      }
    `,
    [height],
  );

  return (
    <RequestPropsProvider {...props}>
      <RequestStoreProvider>
        <Spin spinning={loading} style={{ position: 'absolute', left: '8px', top: '8px' }} />
        <div style={{ height: '100%', display: 'flex', flexFlow: 'column', overflowX: 'hidden' }}>
          <NavigationBar />
          <Divider style={{ width: '100%', margin: '0 0 8px 0' }} />

          <Allotment vertical css={AllotmentCSS}>
            <Allotment.Pane minSize={96} preferredSize='60%'>
              <Request />
            </Allotment.Pane>
            <Allotment.Pane snap>
              <Response />
            </Allotment.Pane>
          </Allotment>
        </div>
      </RequestStoreProvider>
    </RequestPropsProvider>
  );
});

export default ArexRequest;
