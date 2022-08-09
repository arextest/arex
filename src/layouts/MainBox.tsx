import {
  ApiOutlined,
  DeploymentUnitOutlined,
  FieldTimeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import {
  Button,
  Divider,
  Empty,
  Select,
  TabPaneProps,
  Tabs,
  TabsProps,
  Tooltip,
  Typography,
} from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AppFooter, AppHeader, CollectionMenu, EnvironmentMenu, ReplayMenu } from '../components';
import { CollectionProps, CollectionRef } from '../components/httpRequest/CollectionMenu';
import { MenuTypeEnum, PageTypeEnum, RoleEnum } from '../constant';
import { Environment, Folder, HttpRequest, Replay, ReplayAnalysis, ReplayCase } from '../pages';
import { HttpRequestMode } from '../pages/HttpRequest';
import WorkspaceOverviewPage from '../pages/WorkspaceOverview';
import EnvironmentService from '../services/Environment.service';
import { ApplicationDataType, PlanItemStatistics } from '../services/Replay.type';
import { PaneType, useStore } from '../store';
import { uuid } from '../utils';
import DraggableLayout from './DraggableLayout';
const { Text } = Typography;

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
  // 添加高亮条 tabs-ink-bar
  // 注意当前的作用范围很广，目前的作用对象为工作区所有的可编辑可删除卡片式 Tab
  // .ant-tabs-tab-with-remove 类是为了避免污染一般的 Tabs
  .ant-tabs-tab-with-remove.ant-tabs-tab-active:after {
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

const WorkspacesMenu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
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
    collectionTreeData,
    activeMenu,
    setActiveMenu,
    environment,
    environmentTreeData,
    setEnvironment,
    setEnvironmentTreeData,
    workspaces,
  } = useStore();

  // TODO 移动至子组件
  useEffect(() => {
    // const pageType = panes.find((i) => i.key === activePane)?.pageType;
    // if (pageType && activePane) {
    //   nav(`/${params.workspaceId}/workspace/${params.workspaceName}/${pageType}/${activePane}`);
    // }
    // fetchEnvironmentData();
    console.log(
      params.workspaceId,
      params.workspaceName,
      'params.workspaceId && params.workspaceName',
    );
    if (params.workspaceId && params.workspaceName) {
      handleHeaderMenuClick();
    }
  }, [params.workspaceId, params.workspaceName]);

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
  };

  const handleHeaderMenuClick = () => {
    params.workspaceName &&
      params.workspaceId &&
      setPanes(
        {
          title: params.workspaceName,
          key: params.workspaceId,
          menuType: MenuTypeEnum.Collection,
          pageType: PageTypeEnum.WorkspaceOverview,
          isNew: true,
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

  const roleDisplay = (() => {
    return `(${
      {
        [RoleEnum.Admin]: 'Admin',
        [RoleEnum.Editor]: 'Editor',
        [RoleEnum.Viewer]: 'Viewer',
        // @ts-ignore
      }[workspaces.find((i) => i.id === params.workspaceId)?.role]
    })`;
  })();

  return (
    <>
      {/*AppHeader部分*/}
      <AppHeader />

      <DraggableLayout
        direction={'horizontal'}
        limitRange={[15, 40]}
        firstNode={
          <>
            {/* TODO 和 AppHeader 中的 WorkspaceSelect 合并 */}
            <WorkspacesMenu>
              <Tooltip title={`Open overview of ${params.workspaceName}`} placement={'right'}>
                <Button
                  size='small'
                  type='text'
                  icon={<UserOutlined />}
                  onClick={handleHeaderMenuClick}
                >
                  {params.workspaceName}
                  <Text style={{ marginLeft: '4px' }} type='secondary'>
                    {roleDisplay}
                  </Text>
                </Button>
              </Tooltip>
              <Button type='text' size='small' disabled>
                Import
              </Button>
            </WorkspacesMenu>

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
                <Select
                  value={environment}
                  style={{ width: 200, borderLeft: '1px solid #eee' }}
                  allowClear
                  bordered={false}
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
                </Select>
              }
            >
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
