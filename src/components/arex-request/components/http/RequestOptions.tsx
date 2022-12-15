import { css, jsx } from '@emotion/react';
import { Badge, Tabs, Tag } from 'antd';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { TabBarRecoverWrapper } from '../../../index';
import { HttpContext } from '../../index';
import HttpBody from './Body';
import HttpHeaders from './Headers';
import HttpParameters from './Parameters';
import HttpPreRequestScript from './PreRequestScript';
import HttpTests from './Tests';
const HttpRequestOptions:FC<{config:any}> = ({ config }) => {
  const { store } = useContext(HttpContext);
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('3');

  const items = useMemo(
    () =>
      [
        {
          label: (
            <span>
              {t('tab.parameters')}{' '}
              <Tag
                css={css`
                  display: ${store.request.params.length > 0 ? 'inline' : 'none'};
                `}
              >
                {store.request.params.length}
              </Tag>
            </span>
          ),
          key: '0',
          children: <HttpParameters />,
        },
        {
          label: (
            <span>
              {t('tab.headers')}{' '}
              <Tag
                css={css`
                  display: ${store.request.headers.length > 0 ? 'inline' : 'none'};
                `}
              >
                {store.request.headers.length}
              </Tag>
            </span>
          ),
          key: '1',
          children: <HttpHeaders />,
        },
        { label: t('tab.body'), key: '3', children: <HttpBody /> },
        { label: t('tab.tests'), key: '4', children: <HttpTests /> },
        {
          key: 'pre-requestScript',
          label: 'Pre-request Script',
          children: <HttpPreRequestScript />,
        },
      ].concat(config.tabs.extra.filter((e:any) => !e.hidden)),
    [config,store.request],
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
