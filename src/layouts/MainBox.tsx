import { ApiOutlined, DeploymentUnitOutlined, FieldTimeOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Empty, TabPaneProps, Tabs, TabsProps } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ApplicationDataType } from '../api/Replay.type';
import { AppFooter, AppHeader, CollectionMenu, EnvironmentMenu, ReplayMenu } from '../components';
import { CollectionProps, CollectionRef, nodeType } from '../components/httpRequest/CollectionMenu';
import { MenuTypeEnum, PageTypeEnum } from '../constant';
import { Environment, Folder, HttpRequest, Replay } from '../pages';
import { HttpRequestMode } from '../pages/HttpRequest';
import WorkspaceOverviewPage from '../pages/WorkspaceOverview';
import { Workspace, WorkspaceService } from '../services/WorkspaceService';
import { useStore } from '../store';
import DraggableLayout from './DraggableLayout';

// TODO 数据结构待规范
export type PaneType = {
  title: string;
  key: string;
  menuType: MenuTypeEnum;
  pageType: PageTypeEnum;
  isNew?: boolean;
  data?: nodeType | ApplicationDataType; // 不同 MenuItem 组件传递的完整数据类型, 后续不断扩充
};

const { TabPane } = Tabs;
const MainMenu = styled(Tabs)`
  height: 100%;
  .ant-tabs-nav-list {
    width: 100px;
    .ant-tabs-tab {
      margin: 0 !important;
      padding: 12px 0 !important;
      .ant-tabs-tab-btn {
        margin: 0 auto;
      }
    }
    .ant-tabs-tab-active {
      background-color: ${(props) => props.theme.color.selected};
    }
    .ant-tabs-ink-bar {
      left: 0;
    }
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

type MenuTitleProps = { title: string; icon?: ReactNode };
const MenuTitle = styled((props: MenuTitleProps) => (
  <div {...props}>
    <i>{props.icon}</i>
    <span>{props.title}</span>
  </div>
))<MenuTitleProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  i {
    width: 14px;
    height: 24px;
  }
`;

const MainTabs = styled((props: TabsProps) => (
  <Tabs
    size='small'
    type='editable-card'
    tabBarGutter={-1}
    tabBarStyle={{
      left: '-11px',
      top: '-1px',
    }}
    {...props}
  >
    {props.children}
  </Tabs>
))<TabsProps>`
  height: 100%;
  // tabs-ink-bar
  .ant-tabs-tab-active:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${(props) => props.theme.color.primary};
    transition: all 0.2s ease-in-out;
  }
  .ant-tabs-content-holder {
    overflow: auto;
  }
`;

const MainTabPane = styled((props: TabPaneProps) => (
  <TabPane {...props}>{props.children}</TabPane>
))<TabPaneProps>`
  padding: 0 8px;
  overflow: auto;
`;

const EmptyWrapper = styled(Empty)`
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
`;

const MainBox = () => {
  const params = useParams();
  const nav = useNavigate();
  const {
    userInfo,
    panes,
    setPanes,
    activePane,
    setActivePane,
    activeMenu,
    setActiveMenu,
    collectionTreeData,
  } = useStore();

  const addTab = () => {
    const newActiveKey = String(Math.random());
    setPanes(
      {
        key: newActiveKey,
        title: 'New Request',
        pageType: PageTypeEnum.Request,
        menuType: MenuTypeEnum.Collection,
        isNew: true,
      },
      'push',
    );
    setActivePane(newActiveKey);
  };

  const removeTab = (targetKey: string) => {
    const filteredPanes = panes.filter((i) => i.key !== targetKey);
    setPanes(filteredPanes);

    if (filteredPanes.length) {
      const lastKey = filteredPanes[filteredPanes.length - 1].key;
      setActivePane(lastKey);
      updateCollectionMenuKeys([lastKey]);
    } else {
      updateCollectionMenuKeys([]);
    }
  };

  const handleTabsEdit: any = (targetKey: string, action: 'add' | 'remove') => {
    action === 'add' ? addTab() : removeTab(targetKey);
  };

  const handleTabsChange = (activePane: string) => {
    const pane = panes.find((i) => i.key === activePane);
    setActivePane(activePane);
    setActiveMenu(pane?.menuType || MenuTypeEnum.Collection);
    updateCollectionMenuKeys([activePane]);
  };

  const collectionRef = useRef<CollectionRef>(null);
  const updateCollectionMenuKeys = (keys: React.Key[]) => {
    collectionRef?.current?.setSelectedKeys(keys);
  };

  function activeEnvironmentPane() {
    setPanes(
      {
        title: 'title',
        key: 'key',
        menuType: MenuTypeEnum.Environment,
        pageType: PageTypeEnum.Environment,
        isNew: true,
      },
      'push',
    );
    setActivePane('key');
  }

  const handleCollectionMenuClick: CollectionProps['onSelect'] = (key, node) => {
    if (!panes.map((i) => i.key).includes(key)) {
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
    }
    setActivePane(key);
  };

  const handleReplayMenuClick = (app: ApplicationDataType) => {
    if (!panes.find((i) => i.key === app.appId)) {
      setPanes(
        {
          title: app.appId,
          key: app.appId,
          menuType: MenuTypeEnum.Replay,
          pageType: PageTypeEnum.Replay,
          isNew: true,
          data: app,
        },
        'push',
      );
    }
    setActivePane(app.appId);
  };

  // TODO 建议放到 HttpRequest 组件中
  const handleInterfaceSaveAs = (pane: PaneType) => {
    // fetchCollectionTreeData(); // TODO 更新 Collection 数据
    const newPanes = [...panes.filter((i) => i.key !== activePane)];
    newPanes.push({
      key: pane.key,
      isNew: true,
      title: pane.title,
      menuType: MenuTypeEnum.Collection,
      pageType: PageTypeEnum.Request,
    });
    setPanes(newPanes);
    setActivePane(pane.key);
  };

  // TODO 建议放到和 workspaces 强关联的 WorkspacesContent 组件中
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]); // TODO 放置全局 store
  useEffect(() => {
    const pageType = panes.find((i) => i.key === activePane)?.pageType;
    if (pageType && activePane) {
      nav(`/${params.workspaceId}/workspace/${params.workspaceName}/${pageType}/${activePane}`);
    }
  }, [activePane]);
  useRequest(
    () =>
      WorkspaceService.listWorkspace({
        userName: userInfo!.email as string,
      }),
    {
      // "/"路由时需拉去第一个workspace
      // ready: !!userInfo?.email && !!params.workspaceId,
      refreshDeps: [params.workspaceId],
      onSuccess(workspaces) {
        setWorkspaces(workspaces);
        if (
          params.workspaceName &&
          params.workspaceId &&
          !panes.map((pane) => pane.pageType).includes(PageTypeEnum.WorkspaceOverview)
        ) {
          setPanes(
            {
              title: params.workspaceName as string,
              key: params.workspaceId as string,
              menuType: MenuTypeEnum.Collection,
              pageType: PageTypeEnum.WorkspaceOverview,
              isNew: true,
            },
            'push',
          );
          setActivePane(params.workspaceId);
        } else {
          nav(`/${workspaces[0].id}/workspace/${workspaces[0].workspaceName}`);
        }
      },
    },
  );

  const handleMenuChange = (activeKey: string) => {
    setActiveMenu(activeKey as MenuTypeEnum);
  };

  return (
    <>
      {/*AppHeader部分*/}
      <AppHeader workspaces={workspaces} />

      <DraggableLayout
        direction={'horizontal'}
        limitRange={[30, 40]}
        firstNode={
          // 左侧菜单区
          <MainMenu activeKey={activeMenu} tabPosition='left' onChange={handleMenuChange}>
            {/* menuItem 自定义子组件命名规定: XxxMenu, 表示xx功能的左侧主菜单 */}
            {/* menuItem 自定义子组件 props 约定，便于之后封装  */}
            {/* 1. ref?: 组件ref对象，用于调用组件自身属性方法。尽量不使用，使用前请思考是否还有别的方法 */}
            {/* 1. xxId?: 涉及组件初始化的全局id，之后可以将该参数置于全局状态管理存储 */}
            {/* 2. onSelect: 选中 menu item 时触发，参数（结构待规范）为选中节点的相关信息，点击后的逻辑不在 Menu 组件中处理 */}
            <MainMenuItem
              tab={<MenuTitle icon={<ApiOutlined />} title='Collection' />}
              key={MenuTypeEnum.Collection}
              menuItem={
                <CollectionMenu
                  workspaceId={params.workspaceId}
                  onSelect={handleCollectionMenuClick}
                  ref={collectionRef}
                />
              }
            />
            <MainMenuItem
              tab={<MenuTitle icon={<FieldTimeOutlined />} title='Replay' />}
              key={MenuTypeEnum.Replay}
              menuItem={<ReplayMenu onSelect={handleReplayMenuClick} />}
            />
            <MainMenuItem
              disabled
              tab={<MenuTitle icon={<DeploymentUnitOutlined />} title='Environment' />}
              key={MenuTypeEnum.Environment}
              menuItem={<EnvironmentMenu activePane={activeEnvironmentPane} />}
            />
          </MainMenu>
        }
        secondNode={
          // 右侧工作区
          panes.length ? (
            <MainTabs onEdit={handleTabsEdit} activeKey={activePane} onChange={handleTabsChange}>
              {panes.map((pane) => (
                <MainTabPane tab={pane.title} key={pane.key}>
                  {/* TODO 工作区自定义组件待规范，参考 menuItem */}
                  {pane.pageType === PageTypeEnum.Request && (
                    <HttpRequest
                      collectionTreeData={collectionTreeData}
                      mode={HttpRequestMode.Normal}
                      id={pane.key}
                      isNew={pane.isNew}
                      onSaveAs={handleInterfaceSaveAs}
                    />
                  )}
                  {pane.pageType === PageTypeEnum.Replay && (
                    <Replay data={pane.data as ApplicationDataType} />
                  )}
                  {pane.pageType === PageTypeEnum.Folder && <Folder />}
                  {pane.pageType === PageTypeEnum.Environment && <Environment />}
                  {pane.pageType === PageTypeEnum.WorkspaceOverview && <WorkspaceOverviewPage />}
                </MainTabPane>
              ))}
            </MainTabs>
          ) : (
            <EmptyWrapper>
              <Button type='primary' onClick={addTab}>
                New Request
              </Button>
            </EmptyWrapper>
          )
        }
      />

      <AppFooter />
    </>
  );
};

export default MainBox;
