import { ApiOutlined, DeploymentUnitOutlined, FieldTimeOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Empty, TabPaneProps, Tabs } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useImmer } from 'use-immer';

import { AppFooter, AppHeader, CollectionMenu, EnvironmentMenu, ReplayMenu } from '../components';
import { CollectionRef } from '../components/httpRequest/CollectionMenu';
import { MenuTypeEnum, NodeType, PageTypeEnum } from '../constant';
import { Environment, Folder, HttpRequest, Replay } from '../pages';
import { HttpRequestMode } from '../pages/HttpRequest';
import WorkspaceOverviewPage from '../pages/WorkspaceOverview';
import { Workspace, WorkspaceService } from '../services/WorkspaceService';
import { useStore } from '../store';
import DraggableLayout from './DraggableLayout';

type PaneProps = {
  title: string;
  key: string;
  pageType: PageTypeEnum;
  qid: string;
  isNew?: boolean;
  nodeType: NodeType;
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

const EmptyWrapper = styled(Empty)`
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
`;

const MainBox = () => {
  const params = useParams();
  const nav = useNavigate();
  const userInfo = useStore((store) => store.userInfo);
  // *************workspaces**************************
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  // *************panes**************************
  // TODO 数据结构待规范
  const [panes, setPanes] = useImmer<PaneProps[]>([]);

  // *tab相关
  const [activeKey, setActiveKey] = useState('');
  useEffect(() => {
    const pageType = panes.find((i) => i.key === activeKey)?.pageType;
    if (pageType && activeKey) {
      nav(`/${params.workspaceId}/workspace/${params.workspaceName}/${pageType}/${activeKey}`);
    }
  }, [activeKey]);

  const addTab = () => {
    const newActiveKey = String(Math.random());
    setPanes((panes) => {
      panes.push({
        title: 'New Request',
        key: newActiveKey,
        pageType: PageTypeEnum.Request,
        qid: newActiveKey,
        isNew: true,
        // 其实nodeType应该得通过qid拿到
        nodeType: 3,
      });
    });
    setActiveKey(newActiveKey);
  };

  const removeTab = (targetKey: string) => {
    const f = panes.filter((i) => i.key !== targetKey);
    setPanes(f);

    if (f.length > 0) {
      setActiveKey(f[f.length - 1].key);
      updateCollectionMenuKeys([f[f.length - 1].key]);
    } else {
      updateCollectionMenuKeys([]);
    }
  };

  const handleTabsEdit: any = (targetKey: string, action: 'add' | 'remove') => {
    if (action === 'add') {
      addTab();
    } else {
      removeTab(targetKey);
    }
  };

  const handleTabsChange = (activeKey: string) => {
    setActiveKey(activeKey);
    updateCollectionMenuKeys([activeKey]);
  };

  const collectionRef = useRef<CollectionRef>(null);
  const updateCollectionMenuKeys = (keys: React.Key[]) => {
    collectionRef?.current?.setSelectedKeys(keys);
  };

  function activeEnvironmentPane() {
    setPanes((panes) => {
      panes.push({
        title: 'title',
        key: 'key',
        pageType: PageTypeEnum.Environment,
        qid: 'key',
        isNew: true,
        curApp: {},
      });
    });
    setActiveKey('key');
  }

  const handleCollectionMenuClick = (keys, info) => {
    if (keys[0] && info.node.nodeType !== 3 && !panes.map((i) => i.key).includes(keys[0])) {
      setPanes((panes) => {
        panes.push({
          title: info.node.title,
          key: keys[0],
          pageType: PageTypeEnum.Request,
          qid: keys[0],
          nodeType: info.node.nodeType,
        });
      });
    }

    if (keys[0] && info.node.nodeType === 3 && !panes.map((i) => i.key).includes(keys[0])) {
      setPanes((panes) => {
        panes.push({
          title: info.node.title,
          key: keys[0],
          pageType: PageTypeEnum.Folder,
          qid: keys[0],
          nodeType: 3,
          isNew: true,
        });
      });
    }

    if (keys[0]) {
      setActiveKey(keys[0]);
    }
  };

  const handleReplayMenuClick = (app) => {
    if (!panes.find((i) => i.key === app.appId)) {
      setPanes((panes) => {
        panes.push({
          title: app.appId,
          key: app.appId,
          pageType: PageTypeEnum.Replay,
          qid: app.appId,
          isNew: true,
          curApp: app,
        });
      });
    }
    setActiveKey(app.appId);
  };

  useRequest(
    () =>
      WorkspaceService.listWorkspace({
        userName: userInfo!.email as string,
      }),
    {
      ready: !!userInfo?.email,
      refreshDeps: [params.workspaceId],
      onSuccess(workspaces) {
        setWorkspaces(workspaces);
        if (params.workspaceName && params.workspaceId) {
          setPanes((panes) => {
            panes.push({
              title: params.workspaceName,
              key: params.workspaceId,
              pageType: PageTypeEnum.WorkspaceOverview,
              qid: params.workspaceId,
              isNew: true,
            });
          });
          setActiveKey(params.workspaceId);
        } else {
          nav(`/${workspaces[0].id}/workspace/${workspaces[0].workspaceName}`);
        }
      },
    },
  );

  return (
    <>
      {/*AppHeader部分*/}
      <AppHeader workspaces={workspaces} />

      <DraggableLayout
        direction={'horizontal'}
        limitRange={[30, 40]}
        firstNode={
          // 左侧菜单区
          <MainMenu tabPosition='left'>
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
            <Tabs
              size='small'
              type='editable-card'
              tabBarGutter={-1}
              onEdit={handleTabsEdit}
              activeKey={activeKey}
              onChange={handleTabsChange}
              tabBarStyle={{
                left: '-11px',
                top: '-1px',
              }}
            >
              {panes.map((pane) => (
                <TabPane closable tab={pane.title} key={pane.key} style={{ padding: '0 8px' }}>
                  {/* TODO 工作区自定义组件待规范，参考 menuItem */}
                  {pane.pageType === PageTypeEnum.Request && (
                    <HttpRequest
                      collectionTreeData={[]} // TODO 建议存放至全局state
                      mode={HttpRequestMode.Normal}
                      id={pane.qid}
                      isNew={pane.isNew}
                      onSaveAs={(p) => {
                        // fetchCollectionTreeData(); // TODO
                        const newPanes = [...panes.filter((i) => i.key !== activeKey)];
                        newPanes.push({
                          isNew: true,
                          title: p.title,
                          key: p.key,
                          pageType: PageTypeEnum.Request,
                          qid: p.key,
                          // 其实nodeType应该得通过qid拿到
                          nodeType: 3,
                        });
                        setPanes(newPanes);
                        setActiveKey(p.key);
                      }}
                    />
                  )}
                  {pane.pageType === PageTypeEnum.Replay && <Replay curApp={pane.curApp} />}
                  {pane.pageType === PageTypeEnum.Folder && <Folder />}
                  {pane.pageType === PageTypeEnum.Environment && <Environment />}
                  {pane.pageType === PageTypeEnum.WorkspaceOverview && <WorkspaceOverviewPage />}
                </TabPane>
              ))}
            </Tabs>
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
