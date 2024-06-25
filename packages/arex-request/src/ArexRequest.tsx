import { css } from '@arextest/arex-core';
import { Allotment } from 'allotment';
import { Divider, Spin, TabPaneProps } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';

import NavigationBar, { NavigationBarRef } from './components/NavigationBar';
import Request, { RequestProps } from './components/Request';
import Response, { ResponseRef } from './components/Response';
import i18n from './i18n';
import { RequestPropsProvider, RequestStoreProvider } from './providers';
import { ArexRESTRequest } from './types';
import { GenReq, GenRes } from './types/ArexAITypes';

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

export type ModelInfo = {
  modelName: string;
};

export type AIConfig = {
  gptProvider: (r: GenReq) => Promise<GenRes>;
  modelInfos: ModelInfo[];
};

export interface ArexRequestProps extends RequestProps {
  loading?: boolean;
  height?: string;
  language?: string;
  data?: ArexRESTRequest;
  config?: HttpConfig;
  ai?: AIConfig;
}

export interface ArexRequestRef extends NavigationBarRef, ResponseRef {}

const ArexRequest = forwardRef<ArexRequestRef, ArexRequestProps>((props, ref) => {
  const { loading = false, height } = props;

  const navigationBarRef = useRef<NavigationBarRef>(null);
  const responseRef = useRef<ResponseRef>(null);
  useImperativeHandle(
    ref,
    () => ({
      save: (key?: string) => navigationBarRef.current?.save(key),
      getResponse: () => responseRef.current?.getResponse(),
    }),
    [navigationBarRef, responseRef],
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
              <Response ref={responseRef} />
            </Allotment.Pane>
          </Allotment>
        </div>
      </RequestStoreProvider>
    </RequestPropsProvider>
  );
});

export default ArexRequest;
