import { css } from '@emotion/react';
import { Badge, Tabs, Tag } from 'antd';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import axios from '../../../../helpers/api/axios';
import ExtraRequestTabItemMock from '../../extra/ExtraRequestTabItemMock';
import { HttpContext } from '../../index';
import HttpBody from './Body';
import HttpHeaders from './Headers';
import HttpParameters from './Parameters';
import HttpPreRequestScript from './PreRequestScript';
import HttpTests from './Tests';
const HttpRequestOptions = () => {
  const { store } = useContext(HttpContext);
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('3');

  const items = [
    {
      label: (
        <div>
          {t('tab.parameters')}{' '}
          <Tag
            css={css`
              display: ${store.request.params.length > 0 ? 'inline-block' : 'none'};
            `}
          >
            {store.request.params.length}
          </Tag>
        </div>
      ),
      key: '0',
      children: <HttpParameters />,
    },
    {
      label: (
        <div>
          {t('tab.headers')}{' '}
          <Tag
            css={css`
              display: ${store.request.headers.length > 0 ? 'inline-block' : 'none'};
            `}
          >
            {store.request.headers.length}
          </Tag>
        </div>
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
    {
      label: 'Mock',
      key: '__mock__',
      children: <ExtraRequestTabItemMock requestAxios={axios} recordId={store.request.recordId} />,
    },
  ];
  return (
    <div
      css={css`
        //相当于最小高度
        padding-left: 16px;
        padding-right: 16px;
        flex: 1;
        display: flex;
        flex-direction: column;
        .ant-tabs-content-holder {
          height: 100px;
        }
      `}
    >
      <Tabs
        style={{ height: '100%' }}
        activeKey={activeKey}
        items={items}
        onChange={(val) => {
          setActiveKey(val);
        }}
      ></Tabs>
    </div>
  );
};

export default HttpRequestOptions;
