import { LeftOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Menu, MenuProps, Tabs, TabsProps } from 'antd';
import React, { FC, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ErrorBoundary } from '../components';
import { ArexMenuNamespace } from '../constant';
import { ArexMenuManager } from '../utils';

export type ArexMenuContainerProps = {
  value?: string;
  activeKey?: string;
  collapsed?: boolean;
  onChange?: (menuType: string) => void;
  onCollapsed?: (collapse: boolean) => void;
  onSelect?: (paneType: string, id: string, data: unknown) => void;
};

export type MenuItemType = {
  icon: ReactNode;
  label: ReactNode;
  key: string;
  children?: ReactNode;
};

const ICON_KEY = '__ExpandIcon';

const ArexMenuContainer: FC<ArexMenuContainerProps> = (props) => {
  // 规定: ArexMenu 翻译文本需要配置在 locales/[lang]/arex-menu.json 下, 且 key 为 Menu.types
  const { t } = useTranslation([ArexMenuNamespace]);

  const tabsItems = useMemo<MenuItemType[]>(
    () =>
      ArexMenuManager.getMenus()
        .map((Menu) => ({
          icon: Menu.icon,
          label: t(`${Menu.type}`),
          key: Menu.type,
        }))
        .concat({
          label: '',
          key: ICON_KEY,
          icon: <CollapseButton collapsed={props.collapsed} />,
        }),
    [props.collapsed, t],
  );

  const items = useMemo<TabsProps['items']>(
    () =>
      ArexMenuManager.getMenus().map((Menu) => ({
        label: t(`${Menu.type}`),
        key: Menu.type,
        children: (
          <ErrorBoundary>
            <div id='arex-menu-content-wrapper'>
              <Menu
                value={props.value}
                onSelect={(id, data) =>
                  props.activeKey && props.onSelect?.(Menu.paneType, id, data)
                }
              />
            </div>
          </ErrorBoundary>
        ),
      })),
    [props, t],
  );

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === ICON_KEY) return props.onCollapsed?.(!props.collapsed);
    props.onChange?.(key);
  };

  return (
    <div
      id='arex-menu-wrapper'
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', flex: '1', minHeight: '0' }}>
        <StyledMenu
          mode='inline'
          selectedKeys={props.activeKey ? [props.activeKey] : []}
          inlineCollapsed={props.collapsed}
          items={tabsItems}
          onClick={handleMenuClick}
        />
        {/* 此处利用 Tabs 做组件缓存 */}
        <Tabs
          activeKey={props.activeKey}
          items={items}
          css={css`
            width: 100%;
            overflow-y: hidden;
            .ant-tabs-nav {
              display: none; // 隐藏 Tabs 的导航栏
            }
          `}
        />
      </div>
    </div>
  );
};

const StyledMenu = styled(Menu)`
  width: auto;
  position: relative;
  .ant-menu-item,
  .ant-menu-submenu-title {
    height: auto !important;
    min-width: 64px;
    flex-direction: column;
    padding-top: ${(props) => (props.inlineCollapsed ? 0 : '12px')};
    padding-left: ${(props) => (props.inlineCollapsed ? '24px' : '12px')}!important;
    padding-right: ${(props) => (props.inlineCollapsed ? '24px' : '12px')};
    color: ${(props) => props.theme.colorTextSecondary};

    &.ant-menu-item-active,
    &.ant-menu-item-selected {
      color: ${(props) => props.theme.colorText};
    }

    &.ant-menu-item-selected {
      background-color: ${(props) => props.theme.colorPrimaryBgHover};
    }

    &[data-menu-id$=${ICON_KEY}] {
      position: absolute;
      bottom: 36px;
      left: 0;
    }
    span {
      margin-inline-start: 0 !important;
      &,
      .ant-menu-title-content {
        width: ${(props) => (props.inlineCollapsed ? 0 : 'auto')};
      }
    }
    .ant-menu-submenu-arrow::before,
    .ant-menu-submenu-arrow::after {
      bottom: -16px;
      left: 8px;
    }
  }
`;

const CollapseButton = styled(
  (props: { collapsed?: boolean; children?: ReactNode }) => <LeftOutlined {...props} />,
  { shouldForwardProp: (propName) => propName !== 'collapsed' },
)`
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.2s;
  color: ${(props) => props.theme.colorTextQuaternary};
  transform: rotate(${(props) => (props.collapsed ? '180deg' : '0deg')});
`;

export default ArexMenuContainer;
