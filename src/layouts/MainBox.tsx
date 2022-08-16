import { ApiOutlined, DeploymentUnitOutlined, FieldTimeOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Divider, Empty, TabPaneProps, Tabs, TabsProps } from 'antd';
import { ReactNode, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {
  AppFooter,
  AppHeader,
  CollectionMenu,
  EnvironmentMenu,
  EnvironmentSelect,
  ReplayMenu,
  WorkspacesMenu,
} from '../components';
import { CollectionProps } from '../components/httpRequest/CollectionMenu';
import { MenuTypeEnum, PageTypeEnum } from '../constant';
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
import Setting from '../pages/Setting';
import { ApplicationDataType, PlanItemStatistics } from '../services/Replay.type';
import { useStore } from '../store';
import { uuid } from '../utils';
import DraggableLayout from './DraggableLayout';

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
  .ant-tabs-content {
    height: 100%;
  }
`;
//拖拽
const type = 'DraggableTabNode';
interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  index: React.Key;
  moveNode: (dragIndex: React.Key, hoverIndex: React.Key) => void;
}

const DraggableTabNode = ({ index, children, moveNode }: DraggableTabPaneProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: 'dropping',
      };
    },
    drop: (item: { index: React.Key }) => {
      moveNode(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <div ref={ref} className={isOver ? dropClassName : ''}>
      {children}
    </div>
  );
};

const DraggableTabs: React.FC<{ children: React.ReactNode }> = props => {
  const { children } = props;
  const [order, setOrder] = useState<React.Key[]>([]);

  const moveTabNode = (dragKey: React.Key, hoverKey: React.Key) => {
    const newOrder = order.slice();

    React.Children.forEach(children, (c: React.ReactElement) => {
      if (c.key && newOrder.indexOf(c.key) === -1) {
        newOrder.push(c.key);
      }
    });

    const dragIndex = newOrder.indexOf(dragKey);
    const hoverIndex = newOrder.indexOf(hoverKey);

    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, dragKey);

    setOrder(newOrder);
  };

  const renderTabBar: TabsProps['renderTabBar'] = (tabBarProps, DefaultTabBar) => (
    <DefaultTabBar {...tabBarProps}>
      {node => (
        <DraggableTabNode key={node.key} index={node.key!} moveNode={moveTabNode}>
          {node}
        </DraggableTabNode>
      )}
    </DefaultTabBar>
  );

  const tabs: React.ReactElement[] = [];
  React.Children.forEach(children, (c: React.ReactElement) => {
    tabs.push(c);
  });

  const orderTabs = tabs.slice().sort((a, b) => {
    const orderA = order.indexOf(a.key!);
    const orderB = order.indexOf(b.key!);

    if (orderA !== -1 && orderB !== -1) {
      return orderA - orderB;
    }
    if (orderA !== -1) {
      return -1;
    }
    if (orderB !== -1) {
      return 1;
    }

    const ia = tabs.indexOf(a);
    const ib = tabs.indexOf(b);

    return ia - ib;
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Tabs renderTabBar={renderTabBar} {...props}  type="editable-card">
          {orderTabs}
      </Tabs>
    </DndProvider>
  );
};




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
  <DraggableTabs
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
  </DraggableTabs>
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
    setActiveMenu,
    setActiveEnvironment,
    setCollectionTreeData,
  } = useStore();

  // 必须和路由搭配起来，在切换的时候附着上去
  useEffect(() => {
    const findActivePane = panes.find((i) => i.key === activePane);
    if (findActivePane) {
      nav(
        `/${params.workspaceId}/workspace/${params.workspaceName}/${findActivePane.pageType}/${findActivePane.key}`,
      );
    }
  }, [activePane, panes, params.workspaceId, params.workspaceName]);

  const collectionMenuRef = useRef();

  const fetchCollectionTreeData = () => {
    // @ts-ignore
    collectionMenuRef.current.fetchTreeData();
  };

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
    const menuType = activeMenu[0];
    const filteredPanes = panes.filter((i) => i.key !== targetKey);
    setPanes(filteredPanes);

    if (filteredPanes.length) {
      const lastPane = filteredPanes[filteredPanes.length - 1];
      const lastKey = lastPane.key;
      setActivePane(lastKey);
      setActiveMenu(lastPane.menuType || MenuTypeEnum.Collection, lastKey);
    } else {
      setActiveMenu(menuType);
    }
  };

  const handleTabsEdit: any = (targetKey: string, action: 'add' | 'remove') => {
    action === 'add' ? addTab() : removeTab(targetKey);
  };

  const handleTabsChange = (activePane: string) => {
    console.log('handleTabsChange', activePane);
    const pane = panes.find((i) => i.key === activePane);
    setActivePane(activePane);
    setActiveMenu(pane?.menuType || MenuTypeEnum.Collection, activePane);
  };

  const handleCollectionMenuClick: CollectionProps['onSelect'] = (key, node) => {
    setActiveMenu(MenuTypeEnum.Collection, key);
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
    setActiveMenu(MenuTypeEnum.Replay, app.appId);
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
  const handleEnvironmentMenuClick = (key: string, node) => {
    console.log('handleEnvironmentMenuClick', key, node);
    setActiveEnvironment(key);
    setActiveMenu(MenuTypeEnum.Environment, key);
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
              activeKey={activeMenu[0]}
              onChange={(key) => setActiveMenu(key as MenuTypeEnum)}
            >
              {/* menuItem 自定义子组件命名规定: XxxMenu, 表示xx功能的左侧主菜单 */}
              {/* menuItem 自定义子组件 props 约定，便于之后封装  */}
              {/* 1. value: 选中 menu item 的 id */}
              {/* 2. onSelect: 选中 menu item 时触发，参数（结构待规范）为选中节点的相关信息，点击后的逻辑不在 Menu 组件中处理 */}
              <MainMenuItem
                tab={<MenuTitle icon={<ApiOutlined />} title='Collection' />}
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
                tab={<MenuTitle icon={<FieldTimeOutlined />} title='Replay' />}
                key={MenuTypeEnum.Replay}
                menuItem={<ReplayMenu value={activeMenu[1]} onSelect={handleReplayMenuClick} />}
              />
              <MainMenuItem
                disabled
                tab={<MenuTitle icon={<DeploymentUnitOutlined />} title='Environment' />}
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
              onEdit={handleTabsEdit}
              activeKey={activePane}
              onChange={handleTabsChange}
              tabBarExtraContent={<EnvironmentSelect />}
            >
              {panes.map((pane) => (
                <MainTabPane className='main-tab-pane' tab={pane.title} key={pane.key}>
                  {/* TODO 工作区自定义组件待规范，参考 menuItem */}
                  {pane.pageType === PageTypeEnum.Request && (
                    <HttpRequest
                      id={pane.key}
                      mode={HttpRequestMode.Normal}
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
