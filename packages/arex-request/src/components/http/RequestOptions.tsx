import { css, styled } from '@arextest/arex-core';
import { Badge, Tabs, Tag, theme } from 'antd';
import { FC, useMemo, useState } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useArexRequestProps, useArexRequestStore } from '../../hooks';
import { Tab, TabConfig } from '../Request';
import HttpBody from './Body';
import HttpHeaders from './Headers';
import HttpParameters from './Parameters';
import HttpPreRequestScript from './PreRequestScript';
import HttpTests from './Tests';

const { useToken } = theme;

const HttpRequestOptionsWrapper = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  .ant-tabs-content-holder {
    height: 100px;
  }
`;

export interface HttpRequestOptionsProps {
  config?: TabConfig;
}

const HttpRequestOptions: FC<HttpRequestOptionsProps> = () => {
  const { config } = useArexRequestProps();
  const { store } = useArexRequestStore();

  const { token } = useToken();
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('3');

  const items = useMemo(() => {
    const _items: Tab[] = [
      {
        label: (
          <div>
            {t('tab.parameters')}{' '}
            {store.request.params.length ? <Tag>{store.request.params.length}</Tag> : null}
          </div>
        ),
        key: '0',
        children: <HttpParameters />,
        forceRender: true,
      },
      {
        label: (
          <div>
            {t('tab.headers')}{' '}
            {store.request.headers.length ? <Tag>{store.request.headers.length}</Tag> : null}
          </div>
        ),
        key: '1',
        children: <HttpHeaders />,
        // forceRender: true,
      },
      {
        label: (
          <div>
            {t('tab.body')}{' '}
            {store.request?.body?.body?.length ? <Badge color={token.colorPrimary} /> : null}
          </div>
        ),
        key: '3',
        children: <HttpBody />,
        forceRender: true,
      },
      {
        label: (
          <div>
            {t('tab.pre_request_script')}{' '}
            {store.request.preRequestScript.length ? <Badge color={token.colorPrimary} /> : null}
          </div>
        ),
        key: '4',
        children: <HttpPreRequestScript />,
        forceRender: true,
      },
      {
        label: (
          <div>
            {t('tab.tests')}{' '}
            {store.request.testScript.length ? <Badge color={token.colorPrimary} /> : null}
          </div>
        ),
        key: '5',
        children: <HttpTests />,
        forceRender: true,
      },
    ];

    // concat extra request tabs
    return _items.concat(config?.requestTabs?.extra?.filter((tab) => !tab.hidden) || []);
  }, [store.request]);

  return (
    <HttpRequestOptionsWrapper>
      <Tabs
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
    </HttpRequestOptionsWrapper>
  );
};

export default HttpRequestOptions;
