import { css } from '@arextest/arex-core';
import { Allotment } from 'allotment';
import { Spin, TabPaneProps } from 'antd';
import React, { FC } from 'react';

import { ArexRESTRequest } from '../types';
import HttpRequest, { HttpRequestProps } from './http/Request';
import HttpRequestOptions from './http/RequestOptions';
import HttpResponse from './http/Response';
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

export interface RequestProps extends HttpRequestProps {
  loading?: boolean;
  height?: string;
  data?: ArexRESTRequest;
  config?: HttpConfig;
}

const Request: FC<RequestProps> = (props) => {
  const { loading = false, height } = props;

  return (
    <Spin spinning={loading}>
      <Allotment
        vertical
        css={css`
          height: ${height};
          .ant-tabs-content {
            height: 100%;
            .ant-tabs-tabpane {
              height: inherit;
              overflow: auto;
            }
          }
        `}
      >
        <Allotment.Pane preferredSize={360}>
          <div
            css={css`
              height: 100%;
              display: flex;
              flex-direction: column;
            `}
          >
            <HttpRequest />
            <HttpRequestOptions />
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          <HttpResponse />
        </Allotment.Pane>
      </Allotment>
    </Spin>
  );
};
export default Request;
