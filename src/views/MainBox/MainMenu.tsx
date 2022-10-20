import { LeftOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { TabPaneProps, Tabs } from 'antd';
import React, { FC, ReactNode } from 'react';

import MenuConfig from '../../menus';
import { useStore } from '../../store';

const { TabPane } = Tabs;

type MainMenuProps = {
  collapse?: boolean;
  onChange?: (key: string) => void;
  onCollapse?: (collapse: boolean) => void;
};

const MainMenu: FC<MainMenuProps> = (props) => {
  const { activeMenu } = useStore();

  return (
    <MainMenuWrapper
      tabPosition='left'
      activeKey={activeMenu[0]}
      collapse={props.collapse}
      tabBarExtraContent={
        <CollapseMenuButton
          collapse={props.collapse}
          icon={<LeftOutlined />}
          onClick={() => props.onCollapse?.(!props.collapse)}
        />
      }
      onChange={(key) => {
        props.onChange?.(key);
      }}
    >
      {MenuConfig.map((Config) => (
        // TODO 支持自定义props, ref
        <MainMenuItem
          key={Config.title}
          tab={<MenuTitle icon={<Config.Icon />} title={Config.title} collapse={props.collapse} />}
          menuItem={<Config.Menu />}
        />
      ))}
    </MainMenuWrapper>
  );
};

const MainMenuWrapper = styled(Tabs, { shouldForwardProp: (propName) => propName !== 'collapse' })<{
  collapse?: boolean;
}>`
  height: calc(100% - 35px);
  .ant-tabs-nav-list {
    width: ${(props) => (props.collapse ? '70px' : '100px')};
    .ant-tabs-tab {
      margin: 0 !important;
      padding: 12px 0 !important;
      .ant-tabs-tab-btn {
        margin: 0 auto;
        color: ${(props) => props.theme.color.text.secondary};
      }
      &.ant-tabs-tab-disabled {
        .ant-tabs-tab-btn {
          color: ${(props) => props.theme.color.text.disabled};
        }
      }
      :hover:not(.ant-tabs-tab-disabled) {
        .ant-tabs-tab-btn {
          color: ${(props) => props.theme.color.text.primary};
        }
      }
    }
    .ant-tabs-tab-active {
      background-color: ${(props) => props.theme.color.background.active};
      border-right: 1px solid ${(props) => props.theme.color.border.primary};
      .ant-tabs-tab-btn {
        color: ${(props) => props.theme.color.text.primary};
      }
    }
    .ant-tabs-ink-bar {
      left: 0;
    }
  }
  .ant-tabs-content {
    height: 100%;
    display: ${(props) => (props.collapse ? 'none' : 'inherit')};
  }
  .ant-tabs-extra-content {
    width: 100%;
  }
`;

type MainMenuItemProps = TabPaneProps & { menuItem: ReactNode };
const MainMenuItem = styled((props: MainMenuItemProps) => (
  <TabPane {...props}>{props.menuItem}</TabPane>
))<MainMenuItemProps>`
  height: 100%;
  overflow-y: auto;
  padding: 0 8px !important;
  .ant-tree-node-selected {
    color: ${(props) => props.theme.color.text.highlight};
  }
`;

const CollapseMenuButton = styled(
  (props: { collapse?: boolean; icon?: ReactNode; children?: ReactNode; onClick?: () => void }) => (
    <div {...props}>
      {props.icon}
      {props.children}
    </div>
  ),
  { shouldForwardProp: (propName) => propName !== 'collapse' },
)`
  margin-bottom: 35px;
  text-align: center;
  width: 100%;
  color: ${(props) => props.theme.color.text.watermark};
  cursor: pointer;
  transform: rotate(${(props) => (props.collapse ? '180deg' : '0deg')});
  transition: all 0.2s;
`;

type MenuTitleProps = { collapse?: boolean; title: string; icon?: ReactNode };
const MenuTitle = styled((props: MenuTitleProps) => {
  const { collapse, title, icon, ...restProps } = props;
  return (
    <div {...restProps}>
      <i>{icon}</i>
      {!collapse && <span>{title}</span>}
    </div>
  );
})<MenuTitleProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  i {
    width: 14px;
    height: 24px;
  }
`;

export default MainMenu;
