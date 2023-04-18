import { css } from '@emotion/react';
import { Tabs, TabsProps, theme } from 'antd';
import React, { FC, useEffect, useMemo } from 'react';

import ErrorBoundary from '../components/ErrorBoundary';
import { MenusManager } from '../utils';

export interface ArexMenuContainerProps extends Omit<TabsProps, 'item' | 'onSelect'> {
  value?: string;
  onSelect?: (id: string, paneType: string) => void;
}
const ArexMenuContainer: FC<ArexMenuContainerProps> = (props) => {
  const { items: _items, onSelect, ...TabsProps } = props;
  const token = theme.useToken();
  const items = useMemo(
    () =>
      MenusManager.getMenus().map((Menu) => ({
        label: Menu.name,
        key: Menu.type,
        children: (
          <ErrorBoundary>
            {React.createElement(Menu, {
              onSelect(value) {
                onSelect?.(value, Menu.type);
              },
            })}
          </ErrorBoundary>
        ),
      })),
    [],
  );

  useEffect(() => {
    console.log(props.activeKey);
  }, []);

  return (
    <div
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          display: flex;
          padding: 10px;
          border-bottom: 1px solid ${token.token.colorBorder};
          justify-content: space-between;
        `}
      >
        <span>arex</span>
      </div>
      <Tabs
        css={css`
          flex: 1;
          .ant-tabs-tabpane {
            padding-left: 12px !important;
          }
        `}
        tabPosition='left'
        items={items}
        {...TabsProps}
      />
    </div>
  );
};

export default ArexMenuContainer;
