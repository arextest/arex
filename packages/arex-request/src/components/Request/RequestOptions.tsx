import { css, SmallBadge, styled } from '@arextest/arex-core';
import { Tabs } from 'antd';
import { FC, useMemo, useState } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Tab, TabConfig } from '../../ArexRequest';
import { useArexRequestProps, useArexRequestStore } from '../../hooks';
import PreRequestScript from './PreRequestScript';
import RequestBody from './RequestBody';
import RequestHeaders from './RequestHeaders';
import RequestParameters from './RequestParameters';
import RequestTests from './RequestTests';
import {ArexResponse} from "../../types";

const HttpRequestOptionsWrapper = styled.div`
  height: 100%;
  padding: 0 16px 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  .ant-tabs-content-holder {
    height: 100px;
  }
`;

const HttpRequestOptions = () => {
  const { config } = useArexRequestProps();
  const { store } = useArexRequestStore();

  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('body');

  const items = useMemo(() => {
    const _items: Tab[] = [
      {
        label: <SmallBadge count={store.request.params?.length}>{t('tab.parameters')}</SmallBadge>,
        key: 'parameters',
        children: <RequestParameters />,
        forceRender: true,
      },
      {
        label: <SmallBadge count={store.request.headers?.length}>{t('tab.headers')}</SmallBadge>,
        key: 'headers',
        children: <RequestHeaders />,
        // forceRender: true,
      },
      {
        label: (
          <SmallBadge offset={[4, 2]} dot={!!store.request?.body?.body?.length}>
            {t('tab.body')}
          </SmallBadge>
        ),
        key: 'body',
        children: <RequestBody />,
        forceRender: true,
      },
      {
        label: (
          <SmallBadge offset={[4, 2]} dot={!!store.request?.preRequestScript?.length}>
            {t('tab.pre_request_script')}
          </SmallBadge>
        ),
        key: 'pre_request_script',
        children: <PreRequestScript />,
        forceRender: true,
      },
      {
        label: (
          <SmallBadge offset={[4, 2]} dot={!!store.request.testScript?.length}>
            {t('tab.tests')}
          </SmallBadge>
        ),
        key: 'tests',
        children: <RequestTests />,
        forceRender: true,
      },
    ];

    // concat extra request tabs
    return _items.concat(config?.requestTabs?.extra?.filter((tab) => !tab.hidden) || []);
  }, [store.request, t]);

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
