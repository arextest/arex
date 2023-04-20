import { LeftOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Menu, MenuProps } from 'antd';
import React, { FC, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ErrorBoundary, WorkspacesMenu } from '../components';
import { ArexMenuManager } from '../utils';

export type ArexMenuContainerProps = {
  value?: string;
  activeKey?: string;
  collapsed?: boolean;
  onChange?: (menuType: string) => void;
  onCollapsed?: (collapse: boolean) => void;
  onSelect?: (id: string, paneType: string) => void;
};

export type MenuItemType = {
  icon: ReactNode;
  label: ReactNode;
  key: string;
  children?: MenuItemType[];
};

const ICON_KEY = '__ExpandIcon';

const ArexMenuContainer: FC<ArexMenuContainerProps> = (props) => {
  const { t } = useTranslation();
  const tabsItems = useMemo<MenuItemType[]>(
    () =>
      ArexMenuManager.getMenus()
        .map((Menu) => ({
          icon: Menu.icon,
          // 规定: 翻译文本需要配置在 locales/[lang]/common.json => "arexMenu" 下, 且 key 为 Menu.name 即组件名 (注意首字母大写)
          label: t(`arexMenu.${Menu.name}`),
          key: Menu.type,
        }))
        .concat({
          label: '',
          key: ICON_KEY,
          icon: <CollapseButton collapsed={props.collapsed} />,
        }),
    [props.collapsed, t],
  );

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === ICON_KEY) return props.onCollapsed?.(!props.collapsed);
    props.onChange?.(key);
  };

  const MenuContent = useMemo(() => {
    const Content = ArexMenuManager.getMenuByType(props.activeKey);
    return (
      !props.collapsed &&
      Content && (
        <ErrorBoundary>
          <Content
            value={props.value}
            onSelect={(value) => props.activeKey && props.onSelect?.(value, props.activeKey)}
          />
        </ErrorBoundary>
      )
    );
  }, [props.activeKey, props.collapsed]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <WorkspacesMenu collapsed={props.collapsed} />
      <div style={{ display: 'flex', flex: '1', minHeight: '0' }}>
        <StyledMenu
          mode='inline'
          selectedKeys={props.activeKey ? [props.activeKey] : []}
          inlineCollapsed={props.collapsed}
          items={tabsItems}
          onClick={handleMenuClick}
        />
        <MenuContentWrapper className={'menu-content-wrapper'}>{MenuContent}</MenuContentWrapper>
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
    flex-direction: column;
    padding-top: ${(props) => (props.inlineCollapsed ? 0 : '12px')};
    padding-left: ${(props) => (props.inlineCollapsed ? '24px' : '12px')}!important;
    padding-right: ${(props) => (props.inlineCollapsed ? '24px' : '12px')};
    color: ${(props) => props.theme.colorTextSecondary};

    &.ant-menu-item-active,
    &.ant-menu-item-selected {
      color: ${(props) => props.theme.colorText};
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

const MenuContentWrapper = styled.div`
  padding: 8px;
  flex: auto;
  min-width: 0;
  overflow-y: auto;
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
