import { LeftOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Tabs, theme } from 'antd';
import { GlobalToken } from 'antd/lib/theme/interface';
import React, { FC, ReactNode, useMemo } from 'react';

import MenuConfig, { MenusType } from '../../menus';
import { useStore } from '../../store';

type MainMenuProps = {
  collapse?: boolean;
  onChange?: (key: string) => void;
  onCollapse?: (collapse: boolean) => void;
};

const MainMenu: FC<MainMenuProps> = (props) => {
  const { token } = theme.useToken();

  const { activeMenu, setActiveMenu } = useStore();
  const activeKey = useMemo(() => activeMenu[0], [activeMenu]);

  const tabsItems = useMemo(
    () =>
      MenuConfig.map((Config) => ({
        label: <MenuTitle icon={<Config.Icon />} title={Config.title} collapse={props.collapse} />,
        key: Config.title,
        children: <Config.Menu />,
      })),
    [props.collapse],
  );

  const handleMenuChange = (key: string) => {
    setActiveMenu(key as MenusType);
    props.onChange?.(key);
  };

  return (
    <MainMenuWrapper
      tabPosition='left'
      activeKey={activeKey}
      collapse={props.collapse}
      token={token}
      tabBarExtraContent={
        <CollapseMenuButton
          color={token.colorTextQuaternary}
          collapse={props.collapse}
          icon={<LeftOutlined />}
          onClick={() => props.onCollapse?.(!props.collapse)}
        />
      }
      items={tabsItems}
      onChange={handleMenuChange}
    />
  );
};

const MainMenuWrapper = styled(Tabs, {
  shouldForwardProp: (propName) => propName !== 'collapse',
})<{
  collapse?: boolean;
  token: GlobalToken;
}>`
  height: calc(100% - 35px);
  .ant-tabs-nav-list {
    width: ${(props) => (props.collapse ? '70px' : '100px')};
    .ant-tabs-tab {
      margin: 0 !important;
      padding: 12px 0 !important;
      .ant-tabs-tab-btn {
        margin: 0 auto;
        color: ${(props) => props.token.colorTextSecondary};
      }
      &.ant-tabs-tab-disabled {
        .ant-tabs-tab-btn {
          color: ${(props) => props.token.colorTextTertiary};
        }
      }
      :hover:not(.ant-tabs-tab-disabled) {
        .ant-tabs-tab-btn {
          color: ${(props) => props.token.colorText};
        }
      }
    }
    .ant-tabs-tab-active {
      background-color: ${(props) => props.token.colorPrimaryBg};
      border-right: 1px solid ${(props) => props.token.colorBorder};
      .ant-tabs-tab-btn {
        color: ${(props) => props.token.colorText};
      }
    }
    .ant-tabs-ink-bar {
      left: 0;
    }
  }
  .ant-tabs-content {
    height: 100%;
    display: ${(props) => (props.collapse ? 'none' : 'inherit')};
    overflow-y: auto;
    .ant-tabs-tabpane {
      padding: 0 8px !important;
    }
  }
  .ant-tabs-extra-content {
    width: 100%;
  }
`;

const CollapseMenuButton = styled(
  (props: {
    color?: string;
    collapse?: boolean;
    icon?: ReactNode;
    children?: ReactNode;
    onClick?: () => void;
  }) => (
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
  color: ${(props) => props.color};
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
