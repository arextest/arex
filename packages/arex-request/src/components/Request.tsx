import { css } from '@arextest/arex-core';
import { Allotment } from 'allotment';
import { TabPaneProps } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';

import { useArexRequestProps } from '../hooks';
import { ArexRESTResponse } from '../types/ArexRESTResponse';
import { Environment } from '../types/environment';
import { PostmanTestResult } from '../types/PostmanTestResult';
import { ArexRESTRequest } from '../types/rest';
import HttpRequest from './http/Request';
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

export interface RequestProps {
  height: string;
  environment: Environment;
  value: ArexRESTRequest | undefined;
  config: HttpConfig;
  breadcrumbItems: { title: string }[];
  description: string;
  tags: string[];
  tagOptions: { color: string; label: string; value: string }[];
  disableSave: boolean;
  onSend: (
    r: ArexRESTRequest,
  ) => Promise<{ response: ArexRESTResponse; testResult: PostmanTestResult }>;
  onSave: (r: ArexRESTRequest, response: ArexRESTResponse) => void;
  onSaveAs: () => void;
  onChange: ({
    title,
    description,
    tags,
  }: {
    title?: string;
    description?: string;
    tags?: string[];
  }) => void;
}

export type RequestRef = {
  onSave: (params: { id: string }) => void;
};

const Request = forwardRef<RequestRef, RequestProps>(
  (
    {
      value,
      onSend,
      environment,
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
        store.response &&
          onSave(
            {
              ...store.request,
              id: id,
            },
            store.response,
          );
      },
    }));

    const { store, dispatch } = useArexRequestProps();
    useEffect(() => {
      dispatch((state) => {
        if (value && JSON.stringify(value) !== '{}') {
          state.request = value;
        }
      });
    }, [value]);

    useEffect(() => {
      dispatch((state) => {
        state.environment = environment;
      });
    }, [environment]);

    return (
      <Allotment
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
        vertical={true}
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
    );
  },
);

export default Request;
