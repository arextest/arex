import { css } from '@emotion/react';
import { Badge, Tabs, Tag, theme } from 'antd';
import { FC, useContext, useMemo, useState } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Context } from '../../../../providers/ConfigProvider';
import { TabConfig } from '../../index';
import HttpBody from './Body';
import HttpHeaders from './Headers';
import HttpParameters from './Parameters';
import HttpPreRequestScript from './PreRequestScript';
import HttpTests from './Tests';
const { useToken } = theme;
const HttpRequestOptions: FC<{ config?: TabConfig }> = ({ config }) => {
  const token = useToken();
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('3');
  const { store } = useContext(Context);

  const items = useMemo(() => {
    const _items: any = [
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
        forceRender: true,
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
        forceRender: true,
      },
      // PreRequestScript
      {
        label: (
          <div>
            {t('tab.body')}{' '}
            <Badge
              color={token.token.colorPrimary}
              css={css`
                display: ${(store.request?.body?.body || '').length > 0 ? 'inline-block' : 'none'};
              `}
            />
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
            <Badge
              color={token.token.colorPrimary}
              css={css`
                display: ${store.request.preRequestScript.length > 0 ? 'inline-block' : 'none'};
              `}
            />
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
            <Badge
              color={token.token.colorPrimary}
              css={css`
                display: ${store.request.testScript.length > 0 ? 'inline-block' : 'none'};
              `}
            />
          </div>
        ),
        key: '5',
        children: <HttpTests />,
        forceRender: true,
      },
    ];

    // concat extra request tabs
    config?.extra && _items.push(...config.extra.filter((tab) => !tab.hidden));
    return _items;
  }, [store.request]);
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
      ></Tabs>
    </div>
  );
};

export default HttpRequestOptions;
