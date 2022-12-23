import { css } from '@emotion/react';
import { Tabs, Tag } from 'antd';
import { FC, useContext, useMemo, useState } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { TabBarRecoverWrapper } from '../../../index';
import { HttpContext } from '../../index';
import HttpBody from './Body';
import HttpHeaders from './Headers';
import HttpParameters from './Parameters';
import PreRequestScript from './PreRequestScript';
import TestScript from './TestScript';

const HttpRequestOptions: FC<{ config: any }> = ({ config }) => {
  const { store, dispatch } = useContext(HttpContext);
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('body');

  const items = useMemo(
    () =>
      [
        {
          label: (
            <span>
              {t('tab.parameters')}
              {!!store.request.params.length && <Tag>{store.request.params.length}</Tag>}
            </span>
          ),
          key: 'parameters',
          children: <HttpParameters />,
        },
        {
          label: (
            <span>
              {t('tab.headers')}
              {!!store.request.headers.length && <Tag>{store.request.headers.length}</Tag>}
            </span>
          ),
          key: 'headers',
          children: <HttpHeaders />,
        },
        { label: t('tab.body'), key: 'body', children: <HttpBody /> },

        {
          key: 'pre-requestScript',
          label: 'Pre-request Script',
          children: (
            <PreRequestScript
              value={store.request.preRequestScripts}
              onChange={(value) => {
                dispatch((state) => {
                  state.request.preRequestScripts = value;
                });
              }}
            />
          ),
        },
        {
          label: t('tab.tests'),
          key: 'tests',
          children: (
            <TestScript
              value={store.request.testScripts}
              onChange={(value) => {
                dispatch((state) => {
                  state.request.testScripts = value;
                });
              }}
            />
          ),
        },
      ].concat(config.tabs.extra.filter((e: any) => !e.hidden)),
    [config, store.request],
  );

  return (
    <div
      css={css`
        //相当于最小高度
        padding: 0 16px;
        flex: 1;
        display: flex;
        flex-direction: column;
        .ant-tabs-content-holder {
          height: 100px;
        }
      `}
    >
      <TabBarRecoverWrapper>
        <Tabs
          className={'http-request-options-tab'}
          css={css`
            height: 100%;
            .ant-tabs-nav {
              margin-bottom: 0;
            }
          `}
          activeKey={activeKey}
          items={items}
          onChange={(val) => {
            setActiveKey(val);
          }}
        />
      </TabBarRecoverWrapper>
    </div>
  );
};

export default HttpRequestOptions;
