import { css } from '@arextest/arex-core';
import { Allotment } from 'allotment';
import { Spin, TabPaneProps } from 'antd';
import React, { forwardRef, useImperativeHandle } from 'react';

import { ArexEnvironment, ArexRESTRequest } from '../types';
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
  environments?: ArexEnvironment[];
  data?: ArexRESTRequest;
  config?: HttpConfig;
}

export type RequestRef = {
  onSave: (params: { id: string }) => void;
};

const Request = forwardRef<RequestRef, RequestProps>(
  (
    {
      loading = false,
      onSend,
      onSave,
      onSaveAs,
      breadcrumbItems,
      onChange,
      description,
      tags,
      tagOptions,
      height,
      config,
      disableSave,
    },
    ref,
  ) => {
    useImperativeHandle(ref, () => ({
      onSave: function ({ id }: { id: string }) {
        // store.response &&
        //   onSave(
        //     {
        //       ...store.request,
        //       id: id,
        //     },
        //     store.response,
        //   );
      },
    }));

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
              <HttpRequest
                disableSave={disableSave}
                description={description}
                tags={tags}
                tagOptions={tagOptions}
                breadcrumbItems={breadcrumbItems}
                onChange={onChange}
                onSave={onSave}
                onSend={onSend}
                onSaveAs={onSaveAs}
              />
              <HttpRequestOptions config={config?.requestTabs} />
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <HttpResponse />
          </Allotment.Pane>
        </Allotment>
      </Spin>
    );
  },
);

export default Request;
