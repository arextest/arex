import {
  ApiOutlined,
  DeploymentUnitOutlined,
  FieldTimeOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useMount } from 'ahooks';
import { Button, Empty, TabPaneProps, Tabs, TabsProps } from 'antd';
import React, { ReactNode, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  AppFooter,
  AppHeader,
  CollectionMenu,
  DraggableTabs,
  EnvironmentMenu,
  EnvironmentSelect,
  ReplayMenu,
  WorkspacesMenu,
} from '../components';
import { CollectionProps } from '../components/httpRequest/CollectionMenu';
import { MenuTypeEnum, PageTypeEnum } from '../constant';
import { treeFind } from '../helpers/collection/util';
import {
  Environment,
  Folder,
  HttpRequest,
  Replay,
  ReplayAnalysis,
  ReplayCase,
  ReplaySetting,
  WorkspaceOverview,
} from '../pages';
import Setting from '../pages/Setting';
import { ApplicationDataType, PlanItemStatistics } from '../services/Replay.type';
import { useStore } from '../store';
import { uuid } from '../utils';
import DraggableLayout from './DraggableLayout';

const { TabPane } = Tabs;
const MainMenu = styled(Tabs, { shouldForwardProp: (propName) => propName !== 'brief' })<{
  brief?: boolean;
}>`
  height: 100%;
  .ant-tabs-nav-list {
    width: ${(props) => (props.brief ? '70px' : '100px')};
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
    display: ${(props) => (props.brief ? 'none' : 'inherit')};
  }
  .ant-tabs-extra-content {
    width: 100%;
  }
`;

type MainMenuItemProps = TabPaneProps & { menuItem: ReactNode };
const MainMenuItem = styled((props: MainMenuItemProps) => (
  <TabPane {...props}>{props.menuItem}</TabPane>
))<MainMenuItemProps>`
  padding: 0 8px !important;
  .ant-tree-node-selected {
    color: ${(props) => props.theme.color.text.highlight};
  }
`;

type MenuTitleProps = { brief?: boolean; title: string; icon?: ReactNode };
const MenuTitle = styled((props: MenuTitleProps) => {
  const { brief, title, icon, ...restProps } = props;
  return (
    <div {...restProps}>
      <i>{icon}</i>
      {!brief && <span>{title}</span>}
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

const MainTabs = styled((props: { collapseMenu?: boolean } & TabsProps) => {
  const { collapseMenu, children, ...restProps } = props;
  return (
    <DraggableTabs
      size='small'
      type='editable-card'
      tabBarGutter={-1}
      tabBarStyle={{
        left: collapseMenu ? '-1px' : '-11px',
        top: '-1px',
      }}
      {...restProps}
    >
      {children}
    </DraggableTabs>
  );
})<TabsProps>`
  height: 100%;

  // 工作区 Tabs 全局样式调整
  .ant-tabs-tab {
    .ant-tabs-tab-btn {
      color: ${(props) => props.theme.color.text.secondary}!important;
    }
    &.ant-tabs-tab-active {
      border-bottom: 1px solid ${(props) => props.theme.color.background.primary}!important;
    }
    :hover {
      .ant-tabs-tab-btn {
        color: ${(props) => props.theme.color.text.primary}!important;
      }
    }
  }

  .ant-tabs-tab-with-remove {
    padding: 6px 12px !important;
    // 添加高亮条 tabs-ink-bar
    // 注意当前的作用范围很广，目前的作用对象为工作区所有的可编辑可删除卡片式 Tab
    // .ant-tabs-tab-with-remove 类是为了避免污染一般的 Tabs
    &.ant-tabs-tab-active {
      background-color: ${(props) => props.theme.color.background.primary}!important;
      border-bottom: 1px solid ${(props) => props.theme.color.background.primary}!important;
      :after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: ${(props) => props.theme.color.primary};
        transition: all 0.2s ease-in-out;
      }
    }
    .ant-tabs-tab-remove {
      margin-left: 0;
      padding-right: 0;
    }
  }
  .ant-tabs-content-holder {
    overflow: auto;
  }
  .ant-tabs-nav-more {
    height: 36px;
    border-left: #000c17 1px solid;
  }
`;

const MainTabPane = styled((props: TabPaneProps) => (
  <TabPane {...props}>{props.children}</TabPane>
))<TabPaneProps>`
  padding: 0 8px;
  overflow: auto;
`;

const EmptyWrapper = styled(
  (props: { empty: boolean; emptyContent: ReactNode; children: ReactNode }) => {
    const { empty, emptyContent, children, ...restProps } = props;
    return <div {...restProps}>{empty ? <Empty>{emptyContent}</Empty> : children}</div>;
  },
)`
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
`;

const MainBox = () => {
  const nav = useNavigate();
  const params = useParams();
  const {
    panes,
    setPanes,
    activePane,
    setActivePane,
    activeMenu,
    collapseMenu,
    setCollapseMenu,
    setActiveMenu,
    setActiveEnvironment,
    setCollectionTreeData,
    collectionTreeData,
  } = useStore();

  // 必须和路由搭配起来，在切换的时候附着上去
  useEffect(() => {
    const findActivePane = panes.find((i) => i.key === activePane);
    if (findActivePane) {
      nav(
        `/${params.workspaceId}/workspace/${params.workspaceName}/${findActivePane.pageType}/${findActivePane.key}`,
      );
    }
  }, [activePane, panes]);

  useMount(() => {
    // TODO 只做了Replay的路由刷新优化
    if (params.rType === PageTypeEnum.Replay) {
      setActivePane(params.rTypeId, PageTypeEnum.Replay);
    }
  });

  const collectionMenuRef = useRef();
  const fetchCollectionTreeData = () => {
    collectionMenuRef.current?.fetchTreeData();
  };

  const handleCollapseMenu = () => {
    setCollapseMenu(!collapseMenu);
  };

  const handleMainMenuChange = (key: string) => {
    setActiveMenu(key as MenuTypeEnum);
    collapseMenu && setCollapseMenu(false);
  };

  const addTab = () => {
    setPanes(
      {
        key: uuid(),
        title: 'New Request',
        pageType: PageTypeEnum.Request,
        menuType: MenuTypeEnum.Collection,
        isNew: true,
      },
      'push',
    );
  };

  const removeTab = (targetKey: string) => {
    const menuType = activeMenu[0];
    const filteredPanes = panes.filter((i) => i.key !== targetKey);
    setPanes(filteredPanes);

    if (filteredPanes.length) {
      const lastPane = JSON.parse(JSON.stringify(filteredPanes)).sort(
        (a, b) => -(a.sortIndex - b.sortIndex),
      )[0];
      setActivePane(lastPane.key, lastPane.menuType);
    } else {
      setActiveMenu(menuType);
    }
  };

  const handleTabsEdit: any = (targetKey: string, action: 'add' | 'remove') => {
    action === 'add' ? addTab() : removeTab(targetKey);
  };

  const handleCollectionMenuClick: CollectionProps['onSelect'] = (key, node) => {
    setPanes(
      {
        key,
        title: node.title,
        menuType: MenuTypeEnum.Collection,
        pageType: node.nodeType === 3 ? PageTypeEnum.Folder : PageTypeEnum.Request,
        isNew: false,
        data: node,
      },
      'push',
    );
  };

  const handleReplayMenuClick = (app: ApplicationDataType) => {
    setPanes(
      {
        title: app.appId,
        key: btoa(app.appId),
        menuType: MenuTypeEnum.Replay,
        pageType: PageTypeEnum.Replay,
        isNew: false,
        data: app,
      },
      'push',
    );
  };

  //environment
  const handleEnvironmentMenuClick = (key: string, node) => {
    setActiveEnvironment(key);
    setPanes(
      {
        key,
        title: node.title,
        menuType: MenuTypeEnum.Environment,
        pageType: PageTypeEnum.Environment,
        isNew: false,
        data: node,
      },
      'push',
    );
  };

  const genTabTitle = (collectionTreeData, pane) => {
    // Request类型需要动态响应tittle修改
    if ([PageTypeEnum.Request, PageTypeEnum.Folder].includes(pane.pageType)) {
      return treeFind(collectionTreeData, (item) => item.key === pane.key)?.title || 'New Request';
    } else {
      return pane.title;
    }
  };

  return (
    <>
      {/*AppHeader部分*/}
      <AppHeader />

      <DraggableLayout
        direction={'horizontal'}
        limitRange={[15, 40]}
        fixedFirstNode={collapseMenu}
        firstNode={
          <>
            <WorkspacesMenu />

            <MainMenu
              tabPosition='left'
              activeKey={activeMenu[0]}
              brief={collapseMenu}
              tabBarExtraContent={
                <CollapseMenuButton
                  collapse={collapseMenu}
                  icon={<LeftOutlined />}
                  onClick={handleCollapseMenu}
                />
              }
              onChange={handleMainMenuChange}
            >
              {/* menuItem 自定义子组件命名规定: XxxMenu, 表示xx功能的左侧主菜单 */}
              {/* menuItem 自定义子组件 props 约定，便于之后封装  */}
              {/* 1. value: 选中 menu item 的 id */}
              {/* 2. onSelect: 选中 menu item 时触发，参数（结构待规范）为选中节点的相关信息，点击后的逻辑不在 Menu 组件中处理 */}
              <MainMenuItem
                tab={<MenuTitle icon={<ApiOutlined />} title='Collection' brief={collapseMenu} />}
                key={MenuTypeEnum.Collection}
                menuItem={
                  <CollectionMenu
                    value={activeMenu[1]}
                    onSelect={handleCollectionMenuClick}
                    onGetData={setCollectionTreeData}
                    cRef={collectionMenuRef}
                  />
                }
              />
              <MainMenuItem
                tab={<MenuTitle icon={<FieldTimeOutlined />} title='Replay' brief={collapseMenu} />}
                key={MenuTypeEnum.Replay}
                menuItem={
                  <ReplayMenu
                    initValue={activeMenu[1]}
                    value={activeMenu[1]}
                    onSelect={handleReplayMenuClick}
                  />
                }
              />
              <MainMenuItem
                tab={
                  <MenuTitle
                    icon={<DeploymentUnitOutlined />}
                    title='Environment'
                    brief={collapseMenu}
                  />
                }
                key={MenuTypeEnum.Environment}
                menuItem={
                  <EnvironmentMenu value={activeMenu[1]} onSelect={handleEnvironmentMenuClick} />
                }
              />
            </MainMenu>
          </>
        }
        secondNode={
          // 右侧工作区
          <EmptyWrapper
            empty={!panes.length}
            emptyContent={
              <Button type='primary' onClick={addTab}>
                New Request
              </Button>
            }
          >
            <MainTabs
              activeKey={activePane}
              collapseMenu={collapseMenu}
              tabBarExtraContent={<EnvironmentSelect />}
              onEdit={handleTabsEdit}
              onChange={setActivePane}
            >
              {panes.map((pane) => (
                <MainTabPane
                  className='main-tab-pane'
                  tab={genTabTitle(collectionTreeData, pane)}
                  key={pane.key}
                >
                  {/* TODO 工作区自定义组件待规范，参考 menuItem */}
                  {pane.pageType === PageTypeEnum.Request && (
                    <HttpRequest
                      id={pane.key}
                      isNew={pane.isNew}
                      fetchCollectionTreeData={fetchCollectionTreeData}
                    />
                  )}
                  {pane.pageType === PageTypeEnum.Replay && (
                    <Replay data={pane.data as ApplicationDataType} />
                  )}
                  {pane.pageType === PageTypeEnum.ReplayAnalysis && (
                    <ReplayAnalysis data={pane.data as PlanItemStatistics} />
                  )}
                  {pane.pageType === PageTypeEnum.ReplayCase && (
                    <ReplayCase data={pane.data as PlanItemStatistics} />
                  )}
                  {pane.pageType === PageTypeEnum.ReplaySetting && (
                    <ReplaySetting data={pane.data as ApplicationDataType} />
                  )}
                  {pane.pageType === PageTypeEnum.Folder && <Folder />}
                  {pane.pageType === PageTypeEnum.Environment && <Environment id={pane.key} />}
                  {pane.pageType === PageTypeEnum.WorkspaceOverview && <WorkspaceOverview />}
                  {pane.pageType === PageTypeEnum.Setting && <Setting />}
                </MainTabPane>
              ))}
            </MainTabs>
          </EmptyWrapper>
        }
      />

      <AppFooter />
    </>
  );
};

export default MainBox;
