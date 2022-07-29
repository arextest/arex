import './MainBox.less';
import { FileOutlined, GlobalOutlined, GoldOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import colorLib from '@kurkle/color';
import { Button, Divider, Empty, Space, Tabs, Tooltip } from 'antd';
import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { GlobalContext } from '../App';
import {
  AppHeader,
  CollectionMenu,
  Login,
  ReplayMenu,
} from '../components';
import { CollectionRef } from '../components/httpRequest/CollectionMenu';
import { NodeType, PageTypeEnum } from '../constant';
import { collectionOriginalTreeToAntdTreeData, treeFind } from '../helpers/collection/util';
import { Environment, Folder, HttpRequest, Replay } from '../pages';
import EnvironmentPage from '../pages/Environment';
import { HttpRequestMode } from '../pages/HttpRequest';
import WorkspaceOverviewPage from '../pages/WorkspaceOverview';
import { CollectionService } from '../services/CollectionService';
import { WorkspaceService } from '../services/WorkspaceService';
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
  .ant-tabs-nav-list {
    .ant-tabs-tab {
      margin: 0 !important;
      .ant-tabs-tab-btn {
        margin: 0 auto;
      }
    }
    .ant-tabs-tab-active {
      background-color: ${(props) => colorLib(props.theme.color.primary).alpha(0.1).rgbString()};
    }
  }
`;
const MainMenuItem = styled(TabPane)`
  padding: 0 !important;
`;

const menuItems = [
  {
    key: 'collection',
    label: 'Collection',
    icon: <GlobalOutlined />,
    disabled: false,
  },
  {
    key: 'replay',
    label: 'Replay',
    icon: <FileOutlined />,
    disabled: false,
  },
  {
    key: 'environment',
    label: 'Environment',
    icon: <GoldOutlined />,
    disabled: false,
  },
];

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

// 静态数据
const userinfo = {
  email: 'tzhangm@trip.com',
  avatar: 'https://joeschmoe.io/api/v1/random',
};

const MainBox = () => {
  const _useParams = useParams();
  const _useNavigate = useNavigate();

  const { state: globalState } = useContext(GlobalContext);

  // *************workspaces**************************
  const [workspaces, setWorkspaces] = useState([]);

  // *************panes**************************
  const [panes, setPanes] = useState<PaneProps[]>([]);

  // *************collection**************************
  const [collectionTreeData, setCollectionTreeData] = useState<NodeList[]>([]);
  // *************侧边栏**************************
  const [siderMenuSelectedKey, setSiderMenuSelectedKey] = useState('collection');

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
    const newPanes = [...panes];
    newPanes.push({
      title: 'New Request',
      key: newActiveKey,
      pageType: PageTypeEnum.Request,
      qid: newActiveKey,
      isNew: true,
      // 其实nodeType应该得通过qid拿到
      nodeType: 3,
    });
    setPanes(newPanes);
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
    const newPanes = [...panes];
    newPanes.push({
      title: 'title',
      key: 'key',
      pageType: PageTypeEnum.Environment,
      qid: 'key',
      isNew: true,
      curApp: {},
    });
    setPanes(newPanes);
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
        } else {
          _useNavigate(`/${workspaces[0].id}/workspace/${workspaces[0].workspaceName}`);
        }
      });
    }
  }, [_useParams]);

  function openWorkspaceOverviewPage() {
    const newPanes = [...panes];
    newPanes.push({
      title: 'title',
      key: 'key',
      pageType: PageTypeEnum.WorkspaceOverview,
      qid: 'key',
      isNew: true,
      curApp: {},
    });
    setPanes(newPanes);
    setActiveKey('key');
  }

  return (
      <>
        {!globalState.isLogin ? (
            <Login />
        ) : (
            <div className={'main-box'}>
              {/*AppHeader部分*/}
              <AppHeader userinfo={userinfo} workspaces={workspaces} />
              {/*分割线*/}
              <Divider style={{ margin: '0' }} />
              <div className='requester-contents'>
                <DraggableLayout dir={'horizontal'}>
                  {/*侧边栏*/}
                  {/*requester-left-sidebar-wrapper*/}
                  <div
                      style={{ backgroundColor: 'white' }}
                      className={'requester-left-sidebar-wrapper'}
                  >
                    <div className={'requester-sidebar-horizontal-header'}>
                      <div className='requester-sidebar-horizontal-header__left-container'>
                        <Tooltip
                            title={`open overview of ${_useParams.workspaceName}`}
                            placement={'topRight'}
                        >
                          <a
                              onClick={openWorkspaceOverviewPage}
                              className='requester-sidebar-horizontal-header__active-workspace-name'
                          >
                            <GlobalOutlined style={{ marginRight: '8px' }} />
                            {_useParams.workspaceName}
                          </a>
                        </Tooltip>
                      </div>
                      <div className='requester-sidebar-horizontal-header__right-container'>
                        <Space className={'actions-container'}>
                          <Button size={'small'} type='default' disabled>
                            New
                          </Button>
                          <Button size={'small'} type='default' disabled>
                            Import
                          </Button>
                        </Space>
                      </div>
                    </div>
                    <Divider style={{ margin: '0' }} />
                    <div className={'requester-left-sidebar-container'} style={{ display: 'flex' }}>
                      <MainMenu
                          className={'requester-left-sidebar__header'}
                          mode='vertical'
                          items={menuItems}
                          selectedKeys={[siderMenuSelectedKey]}
                          onSelect={(val) => {
                            setSiderMenuSelectedKey(val.key);
                          }}
                      />
                      {/*flex布局需要overflow:'hidden'内部元素出滚动条*/}
                      <div
                          className={'requester-left-sidebar'}
                          style={{ flex: '1', overflow: 'hidden' }}
                      >
                        <div
                            style={{
                              display: siderMenuSelectedKey === 'collection' ? 'block' : 'none',
                            }}
                        >
                          <CollectionMenu
                              treeData={collectionTreeData}
                              setMainBoxPanes={setPanes}
                              mainBoxPanes={panes}
                              setMainBoxActiveKey={setActiveKey}
                              loading={true}
                              fetchTreeData={() => {
                                fetchCollectionTreeData();
                              }}
                              ref={collectionRef}
                          />
                        </div>
                        <div
                            style={{
                              display:
                                  siderMenuSelectedKey === PageTypeEnum.Environment ? 'block' : 'none',
                            }}
                        >
                          <Environment activePane={activeEnvironmentPane} />
                        </div>
                        <div
                            style={{
                              display: siderMenuSelectedKey === PageTypeEnum.Replay ? 'block' : 'none',
                            }}
                        >
                          <ReplayMenu
                              onSelect={(app) => {
                                const newPanes = [...panes];
                                const f = newPanes.find((i) => i.key === app.appId);
                                if (!f) {
                                  newPanes.push({
                                    title: app.appId,
                                    key: app.appId,
                                    pageType: PageTypeEnum.Replay,
                                    qid: app.appId,
                                    isNew: true,
                                    curApp: app,
                                  });
                                  setPanes(newPanes);
                                  setActiveKey(app.appId);
                                }
                              }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*主区域*/}
                  <div className={'requester-builder'}>
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
                                  pane.title + pane.pageType
                              }
                              key={pane.key}
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
                            {pane.pageType === PageTypeEnum.Environment && <EnvironmentPage />}
                            {pane.pageType === PageTypeEnum.WorkspaceOverview && (
                                <WorkspaceOverviewPage />
                            )}

                            {/*WorkspaceOverview*/}
                          </TabPane>
                      ))}
                    </Tabs>
                    {!panes.length && (
                        <Empty>
                          <Button type='primary' onClick={addTab}>
                            New Request
                          </Button>
                        </Empty>
                    )}
                  </div>
                </DraggableLayout>
              </div>

              {/*<DraggableLayout dir={'horizontal'}>*/}
              {/*  /!*侧边栏*!/*/}
              {/*  <div style={{ display: 'flex' }}>*/}
              {/*    <MainMenu tabPosition='left'>*/}
              {/*      <MainMenuItem*/}
              {/*        tab={<MenuTitle icon={<ApiOutlined />} title='Collection' />}*/}
              {/*        key='collection'*/}
              {/*      >*/}
              {/*        <CollectionMenu*/}
              {/*          treeData={collectionTreeData}*/}
              {/*          setMainBoxPanes={setPanes}*/}
              {/*          mainBoxPanes={panes}*/}
              {/*          setMainBoxActiveKey={setActiveKey}*/}
              {/*          fetchTreeData={() => {*/}
              {/*            fetchCollectionTreeData();*/}
              {/*          }}*/}
              {/*          ref={collectionRef}*/}
              {/*        />*/}
              {/*      </MainMenuItem>*/}
              {/*      <MainMenuItem*/}
              {/*        tab={<MenuTitle icon={<FieldTimeOutlined />} title='Replay' />}*/}
              {/*        key='replay'*/}
              {/*      >*/}
              {/*        <ReplayMenu*/}
              {/*          onSelect={(app) => {*/}
              {/*            const newPanes = [...panes];*/}
              {/*            const f = newPanes.find((i) => i.key === app.appId);*/}
              {/*            if (!f) {*/}
              {/*              newPanes.push({*/}
              {/*                title: app.appId,*/}
              {/*                key: app.appId,*/}
              {/*                pageType: PageTypeEnum.Replay,*/}
              {/*                qid: app.appId,*/}
              {/*                isNew: true,*/}
              {/*                curApp: app,*/}
              {/*              });*/}
              {/*              setPanes(newPanes);*/}
              {/*              setActiveKey(app.appId);*/}
              {/*            }*/}
              {/*          }}*/}
              {/*        />*/}
              {/*      </MainMenuItem>*/}
              {/*      <MainMenuItem*/}
              {/*        tab={<MenuTitle icon={<DeploymentUnitOutlined />} title='Environment' />}*/}
              {/*        key='environment'*/}
              {/*      >*/}
              {/*        <EnvironmentMenu activePane={activeEnvironmentPane} />*/}
              {/*      </MainMenuItem>*/}
              {/*    </MainMenu>*/}
              {/*  </div>*/}

              {/*  /!*主区域*!/*/}
              {/*  <div>*/}
              {/*    <Tabs*/}
              {/*      size='small'*/}
              {/*      type='editable-card'*/}
              {/*      tabBarGutter={-1}*/}
              {/*      onEdit={handleTabsEdit}*/}
              {/*      activeKey={activeKey}*/}
              {/*      onChange={handleTabsChange}*/}
              {/*      tabBarStyle={{*/}
              {/*        left: '-11px',*/}
              {/*        top: '-1px',*/}
              {/*      }}*/}
              {/*    >*/}
              {/*      {panes.map((pane) => (*/}
              {/*        <TabPane*/}
              {/*          closable*/}
              {/*          tab={*/}
              {/*            treeFind(collectionTreeData, (node) => node.key === pane.key)?.title ||*/}
              {/*            pane.title + pane.pageType*/}
              {/*          }*/}
              {/*          key={pane.key}*/}
              {/*        >*/}
              {/*          {pane.pageType === PageTypeEnum.Request && (*/}
              {/*            <HttpRequest*/}
              {/*              collectionTreeData={collectionTreeData}*/}
              {/*              mode={HttpRequestMode.Normal}*/}
              {/*              id={pane.qid}*/}
              {/*              isNew={pane.isNew}*/}
              {/*              onSaveAs={(p) => {*/}
              {/*                fetchCollectionTreeData();*/}
              {/*                const newPanes = [...panes.filter((i) => i.key !== activeKey)];*/}
              {/*                newPanes.push({*/}
              {/*                  isNew: true,*/}
              {/*                  title: p.title,*/}
              {/*                  key: p.key,*/}
              {/*                  pageType: PageTypeEnum.Request,*/}
              {/*                  qid: p.key,*/}
              {/*                  // 其实nodeType应该得通过qid拿到*/}
              {/*                  nodeType: 3,*/}
              {/*                });*/}
              {/*                setPanes(newPanes);*/}
              {/*                setActiveKey(p.key);*/}
              {/*              }}*/}
              {/*            />*/}
              {/*          )}*/}
              {/*          {pane.pageType === PageTypeEnum.Replay && <Replay curApp={pane.curApp} />}*/}
              {/*          {pane.pageType === PageTypeEnum.Folder && <Folder />}*/}
              {/*          {pane.pageType === PageTypeEnum.Environment && <Environment />}*/}
              {/*        </TabPane>*/}
              {/*      ))}*/}
              {/*    </Tabs>*/}
              {/*    {!panes.length && (*/}
              {/*      <Empty>*/}
              {/*        <Button type='primary' onClick={addTab}>*/}
              {/*          New Request*/}
              {/*        </Button>*/}
              {/*      </Empty>*/}
              {/*    )}*/}
              {/*  </div>*/}
              {/*</DraggableLayout>*/}
            </div>
        )}
        {/*<AppFooter />*/}
      </>
  );
};

export default MainBox;
