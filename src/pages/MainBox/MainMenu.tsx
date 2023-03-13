import { LeftOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Menu, MenuProps } from 'antd';
import React, { FC, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ErrorBoundary, WorkspacesMenu } from '../../components';
import MenuConfigList from '../../components/menus';
import { MenuConfig, MenusType } from '../../enums/menus';
import { useStore } from '../../store';

type MainMenuProps = {
  collapse?: boolean;
  onChange?: (key: string) => void;
  onCollapse?: (collapse: boolean) => void;
};

const ICON_KEY = '__ExpandIcon';
type NestedTree = {
  [key: string]: any;
  children?: NestedTree[];
};
function flatTree<T extends NestedTree[]>(tree: T, keyName = 'id') {
  const parentKeyName = `parent${keyName.replace(keyName[0], keyName[0].toUpperCase())}`;
  const result: NestedTree[] = [];
  const flat = (nodes?: NestedTree[]) => {
    if (nodes && nodes.length > 0)
      nodes.forEach((node) => {
        const { children, ...rest } = node;
        result.push({ ...rest, [parentKeyName]: node[keyName] });
        flat(children);
      });
  };
  flat(tree);
  return result;
}

const FlatMenu = flatTree(MenuConfigList, 'key');

const MainMenu: FC<MainMenuProps> = (props) => {
  const { activeMenu, setActiveMenu } = useStore();
  const { t, i18n } = useTranslation('common');
  const activeKey = useMemo(() => activeMenu[0], [activeMenu]);

  const menuTranslation = (menu: MenuConfig) => {
    if (menu.children) {
      menu.children = menu.children.map(menuTranslation);
    }
    return {
      icon: menu.icon,
      key: menu.key,
      label: t(menu.key),
    };
  };

  const tabsItems = useMemo(
    () =>
      MenuConfigList.map(menuTranslation).concat({
        label: '',
        key: ICON_KEY,
        icon: <CollapseButton collapse={props.collapse} />,
      }),
    [props.collapse, i18n.language],
  );

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === ICON_KEY) return props.onCollapse?.(!props.collapse);
    setActiveMenu(key as MenusType);
    props.onChange?.(key);
  };

  const MenuContent = useMemo(() => {
    const Content = FlatMenu.find((menu) => menu.key === activeKey);
    return (
      !props.collapse &&
      Content?.Menu && (
        <ErrorBoundary>
          <Content.Menu />
        </ErrorBoundary>
      )
    );
  }, [activeKey, props.collapse]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <WorkspacesMenu collapse={props.collapse} />
      <div style={{ display: 'flex', flex: '1', minHeight: '0' }}>
        <StyledMenu
          mode='inline'
          selectedKeys={activeKey ? [activeKey] : []}
          inlineCollapsed={props.collapse}
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

// MenuContentWrapper.displayName = 'asfasfs'

const CollapseButton = styled(
  (props: { collapse?: boolean; children?: ReactNode }) => <LeftOutlined {...props} />,
  { shouldForwardProp: (propName) => propName !== 'collapse' },
)`
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.2s;
  color: ${(props) => props.theme.colorTextQuaternary};
  transform: rotate(${(props) => (props.collapse ? '180deg' : '0deg')});
`;

export default MainMenu;
