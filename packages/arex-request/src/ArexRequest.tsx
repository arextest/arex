import { css } from '@arextest/arex-core';
import { Allotment } from 'allotment';
import { Divider, Spin, TabPaneProps } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';

import NavigationBar, { NavigationBarRef } from './components/NavigationBar';
import Request, { RequestProps } from './components/Request';
import Response from './components/Response';
import i18n from './i18n';
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

export type GenReq = {
  apiRes?: string;
  currentScript?: string;
  requirement?: string;
};

export type GenRes = {
  code: string;
  explanation: string;
};
export interface ArexRequestProps extends RequestProps {
  loading?: boolean;
  height?: string;
  language?: string;
  data?: ArexRESTRequest;
  config?: HttpConfig;
  gptProvider?: (r: GenReq) => Promise<GenRes>;
}

export interface ArexRequestRef extends NavigationBarRef {}

const ArexRequest = forwardRef<ArexRequestRef, ArexRequestProps>((props, ref) => {
  const { loading = false, height } = props;

  const navigationBarRef = useRef<NavigationBarRef>(null);
  useImperativeHandle(
    ref,
    () => ({
      save: (key?: string) => navigationBarRef.current?.save(key),
    }),
    [navigationBarRef],
  );

  useEffect(() => {
    i18n.changeLanguage(props.language);
  }, [props.language]);

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
          <NavigationBar ref={navigationBarRef} />
          <Divider style={{ width: '100%', margin: '0 0 8px 0' }} />

          <Allotment vertical css={AllotmentCSS}>
            <Allotment.Pane preferredSize='60%'>
              <Request />
            </Allotment.Pane>
            <Allotment.Pane>
              <Response />
            </Allotment.Pane>
          </Allotment>
        </div>
      </RequestStoreProvider>
    </RequestPropsProvider>
  );
});

export default ArexRequest;
