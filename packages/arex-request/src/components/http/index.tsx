import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import { TabPaneProps } from 'antd';
import React, { FC, forwardRef, useContext, useEffect, useImperativeHandle } from 'react';

import { Context } from '../../providers/RequestProvider';
import HttpRequest from './components/http/Request';
import HttpRequestOptions from './components/http/RequestOptions';
import HttpResponse from './components/http/Response';
import { Environment } from './data/environment';
import { ArexRESTRequest } from './data/rest';
import { ArexRESTResponse } from './helpers/types/ArexRESTResponse';
import { PostmanTestResult } from './helpers/types/PostmanTestResult';
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
export interface HttpProps {
  height: string;
  environment: Environment;
  value: ArexRESTRequest | undefined;
  onSend: (
    r: ArexRESTRequest,
  ) => Promise<{ response: ArexRESTResponse; testResult: PostmanTestResult }>;
  onSave: (r: ArexRESTRequest, response: ArexRESTResponse) => void;
  onSaveAs: () => void;
  config: HttpConfig;
  breadcrumbItems: { title: string }[];
  onChange: ({
    title,
    description,
    tags,
  }: {
    title?: string;
    description?: string;
    tags?: string[];
  }) => void;
  description: string;
  tags: string[];
  tagOptions: { color: string; label: string; value: string }[];
  disableSave: boolean;
}

export type HttpRef = {
  onSave: (params: { id: string }) => void;
};

const Http = forwardRef<HttpRef, HttpProps>(
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
        onSave(
          {
            ...store.request,
            id: id,
          },
          // @ts-ignore
          store.response,
        );
      },
    }));
    const { store, dispatch } = useContext(Context);
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
          {store.request.method !== '' ? (
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
          ) : null}
        </Allotment.Pane>
        <Allotment.Pane>
          <HttpResponse />
        </Allotment.Pane>
      </Allotment>
    );
  },
);

export default Http;
