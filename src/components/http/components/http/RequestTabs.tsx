import { css } from '@emotion/react';
import { Tabs, Tag } from 'antd';
import { FC, useContext, useMemo, useState } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { HttpContext, Tab, TabConfig } from '../../index';
import HttpBody from './Body';
import HttpHeaders from './Headers';
import HttpParameters from './Parameters';
import PreRequestScript from './PreRequestScript';
import TestScript from './TestScript';

const RequestTabs: FC<{ config?: TabConfig }> = ({ config }) => {
  const { store, dispatch } = useContext(HttpContext);
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('body');

  const items = useMemo(() => {
    let _items: Tab[] = [
      {
        label: (
          <span>
            {t('tab.parameters')}
            {!!store.request.params?.length && (
              <Tag style={{ borderRadius: '6px', margin: '0 0 0 4px' }}>
                {store.request.params.length}
              </Tag>
            )}
          </span>
        ),
        key: 'parameters',
        children: <HttpParameters />,
      },
      {
        label: (
          <span>
            {t('tab.headers')}
            {!!store.request.headers?.length && (
              <Tag style={{ borderRadius: '6px', margin: '0 0 0 4px' }}>
                {store.request.headers.length}
              </Tag>
            )}
          </span>
        ),
        key: 'headers',
        children: <HttpHeaders />,
      },
      { label: t('tab.body'), key: 'body', children: <HttpBody /> },

      {
        key: 'pre-requestScript',
        label: t('http.pre-requestScript', { ns: 'components' }),
        children: (
          <PreRequestScript
            multiple
            // @ts-ignore
            value={store.request.preRequestScripts}
            onChange={(value) => {
              dispatch((state) => {
                // @ts-ignore
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
            multiple
            // @ts-ignore
            value={store.request.testScripts}
            onChange={(value) => {
              dispatch((state) => {
                // @ts-ignore
                state.request.testScripts = value;
              });
            }}
          />
        ),
      },
    ];
    // concat extra request tabs
    config?.extra &&
      _items.push(
        // 孟老板需求，compare时才显示compareConfig
        ...config.extra.filter(
          (tab) => !(tab.hidden || (tab.key === 'compareConfig' && store.mode === 'normal')),
        ),
      );

    // filter tabs
    config?.filter && (_items = _items.filter((tab) => config?.filter?.(tab.key)));
    return _items;
  }, [config, store.request, store.mode]);

  return (
    <div
      css={css`
        height: 100%;
        flex: 1;
        overflow: auto;
      `}
    >
      <Tabs
        className={'http-request-options-tab'}
        css={css`
          .ant-tabs-nav {
            margin-bottom: 0;
          }
        `}
        activeKey={activeKey}
        items={items}
        onChange={setActiveKey}
      />
    </div>
  );
};

export default RequestTabs;
