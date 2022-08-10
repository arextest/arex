import { ApiOutlined, DeploymentUnitOutlined, FieldTimeOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Divider, Empty, Select, SelectProps, TabPaneProps, Tabs, TabsProps } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  AppFooter,
  AppHeader,
  CollectionMenu,
  EnvironmentMenu,
  ReplayMenu,
  WorkspacesMenu,
} from '../components';
import { CollectionProps, CollectionRef } from '../components/httpRequest/CollectionMenu';
import { MenuTypeEnum, PageTypeEnum, RoleEnum } from '../constant';
import {
  Environment,
  Folder,
  HttpRequest,
  Replay,
  ReplayAnalysis,
  ReplayCase,
  WorkspaceOverview,
} from '../pages';
import { HttpRequestMode } from '../pages/HttpRequest';
import EnvironmentService from '../services/Environment.service';
import { ApplicationDataType, PlanItemStatistics } from '../services/Replay.type';
import { PaneType, useStore } from '../store';
import { uuid } from '../utils';
import DraggableLayout from './DraggableLayout';

const { Option } = Select;
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
  .ant-tabs-tab-with-remove {
    padding: 6px 12px !important;
    // 添加高亮条 tabs-ink-bar
    // 注意当前的作用范围很广，目前的作用对象为工作区所有的可编辑可删除卡片式 Tab
    // .ant-tabs-tab-with-remove 类是为了避免污染一般的 Tabs
    &.ant-tabs-tab-active:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: ${(props) => props.theme.color.primary};
      transition: all 0.2s ease-in-out;
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

const EnvironmentSelect = styled((props: SelectProps) => (
  <Select allowClear bordered={false} {...props} />
))`
  height: 36px;
  width: 150px;
  box-sizing: content-box;
  border-left: 1px solid ${(props) => props.theme.color.border.primary};
  margin-left: -1px;
  .ant-select-selector {
    height: 100%;
    .ant-select-selection-item {
      line-height: 34px;
    }
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
  const nav = useNavigate();
  const params = useParams();
  const {
    panes,
    setPanes,
    activePane,
    setActivePane,
    activeMenu,
    setActiveMenu,
    environment,
    environmentTreeData,
    setEnvironment,
    setEnvironmentTreeData,
  } = useStore();

  // 必须和路由搭配起来，在切换的时候附着上去
  useEffect(() => {
    const findActivePane = panes.find((i) => i.key === activePane);
    if (findActivePane) {
      nav(
        `/${params.workspaceId}/workspace/${params.workspaceName}/${findActivePane.pageType}/${findActivePane.key}`,
      );
    }
  }, [activePane]);

  const addTab = () => {
    const newActiveKey = uuid();
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
  };

  const removeTab = (targetKey: string) => {
    const filteredPanes = panes.filter((i) => i.key !== targetKey);
    setPanes(filteredPanes);

    if (filteredPanes.length) {
      const lastKey = filteredPanes[filteredPanes.length - 1].key;
      setActivePane(lastKey);
      updateCollectionMenuKeys([lastKey]);
      updateEnvironmentMenuKeys([lastKey]);
    } else {
      updateCollectionMenuKeys([]);
      updateEnvironmentMenuKeys([]);
    }
  };

  const handleTabsEdit: any = (targetKey: string, action: 'add' | 'remove') => {
    console.log(targetKey, action);
    action === 'add' ? addTab() : removeTab(targetKey);
  };

  const handleTabsChange = (activePane: string) => {
    const pane = panes.find((i) => i.key === activePane);
    setActivePane(activePane);
    setActiveMenu(pane?.menuType || MenuTypeEnum.Collection);
    updateCollectionMenuKeys([activePane]);
    updateEnvironmentMenuKeys([activePane]);
    pane?.menuType == 'environment' && setEnvironmentselected([pane.data]);
  };

  const collectionRef = useRef<CollectionRef>(null);
  const updateCollectionMenuKeys = (keys: React.Key[]) => {
    collectionRef?.current?.setSelectedKeys(keys);
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

  const handleEnvionmentMenuClick = (key: string, node: {}) => {
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

  const handleReplayMenuClick = (app: ApplicationDataType) => {
    params.workspaceId &&
      params.workspaceName &&
      setPanes(
        {
          title: app.appId,
          key: app.appId,
          menuType: MenuTypeEnum.Replay,
          pageType: PageTypeEnum.Replay,
          isNew: false,
          data: app,
        },
        'push',
      );
  };

  //environment
  const [environmentselected, setEnvironmentselected] = useState<[]>([]);
  const setEnvironmentSelectedData = (e) => {
    setEnvironmentselected(e);
  };

  const environmentRef = useRef<CollectionRef>(null);
  const updateEnvironmentMenuKeys = (keys: React.Key[]) => {
    environmentRef?.current?.setSelectedKeys(keys);
  };

  const { data: EnvironmentData = [], run: fetchEnvironmentData } = useRequest(
    () => EnvironmentService.getEnvironment({ workspaceId: params.workspaceId }),
    {
      ready: !!params.workspaceId,
      refreshDeps: [params.workspaceId],
    },
  );

  useEffect(() => {
    if (EnvironmentData.length > 0) {
      setEnvironmentTreeData(EnvironmentData);
    }
  }, [EnvironmentData]);

  return (
    <>
      {/*AppHeader部分*/}
      <AppHeader />

      <DraggableLayout
        direction={'horizontal'}
        limitRange={[15, 40]}
        firstNode={
          <>
            <WorkspacesMenu />

            <Divider style={{ margin: '0', width: 'calc(100% + 10px)' }} />

            <MainMenu
              tabPosition='left'
              activeKey={activeMenu}
              onChange={(key) => setActiveMenu(key as MenuTypeEnum)}
            >
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
                tab={<MenuTitle icon={<DeploymentUnitOutlined />} title='Environment' />}
                key={MenuTypeEnum.Environment}
                disabled
                menuItem={
                  <EnvironmentMenu
                    ref={environmentRef}
                    workspaceId={params.workspaceId}
                    onSelect={handleEnvionmentMenuClick}
                    setEnvironmentSelectedData={setEnvironmentSelectedData}
                    fetchEnvironmentData={fetchEnvironmentData}
                  />
                }
              />
            </MainMenu>
          </>
        }
        secondNode={
          // 右侧工作区
          panes.length ? (
            // environmentTreeData={environmentTreeData} setEnvironment={setEnvironment}
            <MainTabs
              onEdit={handleTabsEdit}
              activeKey={activePane}
              onChange={handleTabsChange}
              tabBarExtraContent={
                <EnvironmentSelect
                  value={environment}
                  onChange={(e) => {
                    setEnvironment(e);
                  }}
                >
                  <Option value='0'>No Environment</Option>
                  {environmentTreeData?.map((e: { id: string; envName: string }) => {
                    return (
                      <Option key={e.id} value={e.id}>
                        {e.envName}
                      </Option>
                    );
                  })}
                </EnvironmentSelect>
              }
            >
              {panes.map((pane) => (
                <MainTabPane tab={pane.title} key={pane.key}>
                  {/* TODO 工作区自定义组件待规范，参考 menuItem */}
                  {pane.pageType === PageTypeEnum.Request && (
                    <HttpRequest id={pane.key} mode={HttpRequestMode.Normal} isNew={pane.isNew} />
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
                  {pane.pageType === PageTypeEnum.Folder && <Folder />}
                  {pane.pageType === PageTypeEnum.Environment && (
                    <Environment
                      curEnvironment={environmentselected}
                      fetchEnvironmentData={fetchEnvironmentData}
                    />
                  )}
                  {pane.pageType === PageTypeEnum.WorkspaceOverview && <WorkspaceOverview />}
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
