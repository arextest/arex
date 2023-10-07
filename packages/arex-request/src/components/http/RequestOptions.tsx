import { css, styled } from '@arextest/arex-core';
import { Badge, Tabs, theme } from 'antd';
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

  const { token } = theme.useToken();
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('body');

  const items = useMemo(() => {
    const _items: Tab[] = [
      {
        label: (
          <Badge
            size='small'
            color={token.colorPrimary}
            offset={[6, 0]}
            count={store.request.params?.length}
          >
            {t('tab.parameters')}
          </Badge>
        ),
        key: 'parameters',
        children: <HttpParameters />,
        forceRender: true,
      },
      {
        label: (
          <Badge
            size='small'
            color={token.colorPrimary}
            offset={[6, 0]}
            count={store.request.headers?.length}
          >
            {t('tab.headers')}
          </Badge>
        ),
        key: 'headers',
        children: <HttpHeaders />,
        // forceRender: true,
      },
      {
        label: (
          <Badge
            size='small'
            color={token.colorPrimary}
            offset={[4, 2]}
            dot={!!store.request?.body?.body?.length}
          >
            {t('tab.body')}
          </Badge>
        ),
        key: 'body',
        children: <HttpBody />,
        forceRender: true,
      },
      {
        label: (
          <Badge
            size='small'
            color={token.colorPrimary}
            offset={[4, 2]}
            dot={!!store.request?.preRequestScript?.length}
          >
            {t('tab.pre_request_script')}
          </Badge>
        ),
        key: 'pre_request_script',
        children: <HttpPreRequestScript />,
        forceRender: true,
      },
      {
        label: (
          <Badge
            size='small'
            color={token.colorPrimary}
            offset={[4, 2]}
            dot={!!store.request.testScript?.length}
          >
            {t('tab.tests')}
          </Badge>
        ),
        key: 'tests',
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
        activeKey={activeKey}
        items={items}
        onChange={setActiveKey}
        css={css`
          height: 100%;
          .ant-tabs-nav {
            margin-bottom: 0;
          }
        `}
      />
    </HttpRequestOptionsWrapper>
  );
};

export default HttpRequestOptions;
