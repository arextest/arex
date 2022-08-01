import { ApiOutlined, DeploymentUnitOutlined, FieldTimeOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import colorLib from '@kurkle/color';
import { Button, Divider, Empty, Tabs } from 'antd';
import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useImmer } from 'use-immer';

import { GlobalContext } from '../App';
import {
  AppFooter,
  AppHeader,
  CollectionMenu,
  EnvironmentMenu,
  Login,
  ReplayMenu,
} from '../components';
import { CollectionRef } from '../components/httpRequest/CollectionMenu';
import { MenuTypeEnum, NodeType, PageTypeEnum } from '../constant';
import { collectionOriginalTreeToAntdTreeData, treeFind } from '../helpers/collection/util';
import { Environment, Folder, HttpRequest, Replay } from '../pages';
import { HttpRequestMode } from '../pages/HttpRequest';
import WorkspaceOverviewPage from '../pages/WorkspaceOverview';
import { CollectionService } from '../services/CollectionService';
import { Workspace, WorkspaceService } from '../services/WorkspaceService';
import { NodeList } from '../vite-env';
import DraggableLayout from './DraggableLayout';

type PaneProps = {
  title: string;
  key: string;
  pageType: PageTypeEnum;
  qid: string;
  isNew: true;
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
const MainMenuItem = styled(TabPane)`
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
  const _useParams = useParams();
  const _useNavigate = useNavigate();

  // *************workspaces**************************
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  // *************panes**************************
  const [panes, setPanes] = useImmer<PaneProps[]>([]);

  // *************collection**************************
  const [collectionTreeData, setCollectionTreeData] = useState<NodeList[]>([]);

  function fetchCollectionTreeData() {
    CollectionService.listCollection({ id: _useParams.workspaceId }).then((res) => {
      const roots = res?.data?.body?.fsTree?.roots || [];
      setCollectionTreeData(collectionOriginalTreeToAntdTreeData(roots));
    });
  }

  // *tab相关
  const [activeKey, setActiveKey] = useState('');
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

  // 监听params
  useEffect(() => {
    // 获取所有workspace
    if (localStorage.getItem('email')) {
      WorkspaceService.listWorkspace({
        userName: localStorage.getItem('email'),
      }).then((workspaces) => {
        setWorkspaces(workspaces);
        if (_useParams.workspaceName && _useParams.workspaceId) {
          fetchCollectionTreeData();
          setPanes((panes) => {
            panes.push({
              title: _useParams.workspaceName,
              key: _useParams.workspaceId,
              pageType: PageTypeEnum.WorkspaceOverview,
              qid: _useParams.workspaceId,
              isNew: true,
            });
          });
          setActiveKey(_useParams.workspaceId);
        } else {
          _useNavigate(`/${workspaces[0].id}/workspace/${workspaces[0].workspaceName}`);
        }
      });
    }
  }, [_useParams.workspaceId]);

  return (
    <>
      {/*AppHeader部分*/}
      <AppHeader workspaces={workspaces} />

      <DraggableLayout
        direction={'horizontal'}
        limitRange={[30, 40]}
        firstNode={
          <MainMenu tabPosition='left'>
            <MainMenuItem
              tab={<MenuTitle icon={<ApiOutlined />} title='Collection' />}
              key={MenuTypeEnum.Collection}
            >
              <CollectionMenu
                treeData={collectionTreeData}
                setMainBoxPanes={setPanes}
                mainBoxPanes={panes}
                setMainBoxActiveKey={setActiveKey}
                fetchTreeData={() => {
                  fetchCollectionTreeData();
                }}
                ref={collectionRef}
              />
            </MainMenuItem>
            <MainMenuItem
              tab={<MenuTitle icon={<FieldTimeOutlined />} title='Replay' />}
              key={MenuTypeEnum.Replay}
            >
              <ReplayMenu
                onSelect={(app) => {
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
                }}
              />
            </MainMenuItem>
            <MainMenuItem
              disabled
              tab={<MenuTitle icon={<DeploymentUnitOutlined />} title='Environment' />}
              key={MenuTypeEnum.Environment}
            >
              <EnvironmentMenu activePane={activeEnvironmentPane} />
            </MainMenuItem>
          </MainMenu>
        } // 左侧菜单区
        secondNode={
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
                <TabPane
                  closable
                  tab={
                    treeFind(collectionTreeData, (node) => node.key === pane.key)?.title ||
                    pane.title
                  }
                  key={pane.key}
                  style={{ padding: '0 8px' }}
                >
                  {pane.pageType === PageTypeEnum.Request && (
                    <HttpRequest
                      collectionTreeData={collectionTreeData}
                      mode={HttpRequestMode.Normal}
                      id={pane.qid}
                      isNew={pane.isNew}
                      onSaveAs={(p) => {
                        fetchCollectionTreeData();
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
        } // 右侧工作区
      />

      <AppFooter />
    </>
  );
};

export default MainBox;
