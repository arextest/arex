import { LeftOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useMount, useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { Button, Empty, TabPaneProps, Tabs, TabsProps } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  AppFooter,
  AppHeader,
  DraggableTabs,
  EnvironmentSelect,
  WorkspacesMenu,
} from '../components';
import { MenuTypeEnum } from '../constant';
import { treeFind } from '../helpers/collection/util';
import propsHydration from '../helpers/propsHydration';
import { generateGlobalPaneId, parseGlobalPaneId, uuid } from '../helpers/utils';
import MenuConfig from '../menus';
import { CollectionMenuRef } from '../menus/CollectionMenu';
import Pages, { PageProps, PageTypeEnum } from '../pages';
import EnvironmentService from '../services/Environment.service';
import { useStore } from '../store';

const { TabPane } = Tabs;
const MainMenu = styled(Tabs, { shouldForwardProp: (propName) => propName !== 'collapse' })<{
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

const MainTabs = styled((props: TabsProps) => {
  return (
    <DraggableTabs
      size='small'
      type='editable-card'
      tabBarGutter={-1}
      tabBarStyle={{
        top: '-1px',
        marginBottom: '8px',
      }}
      {...props}
    >
      {props.children}
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
  .ant-tabs-content {
    height: 100%;
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
    pages,
    setPages,
    activeMenu,
    setActiveMenu,
    collectionTreeData,
    setEnvironmentTreeData,
    environmentTreeData,
  } = useStore();

  const [collapseMenu, setCollapseMenu] = useState(false);

  // 必须和路由搭配起来，在切换的时候附着上去
  useEffect(() => {
    const findActivePane = pages.find((i) => i.paneId === activeMenu[1]);
    if (findActivePane) {
      nav(
        `/${params.workspaceId}/workspace/${params.workspaceName}/${findActivePane.pageType}/${findActivePane.rawId}`,
      );
    }
    fetchEnvironmentData();
  }, [activeMenu, pages]);

  useMount(() => {
    // TODO 只做了Replay的路由刷新优化
    if (params.rType === PageTypeEnum.Replay) {
      setActiveMenu(
        MenuTypeEnum.Replay,
        generateGlobalPaneId(MenuTypeEnum.Replay, PageTypeEnum.Replay, params.rTypeId),
      );
    }
    if (params.rType === PageTypeEnum.Environment) {
      setActiveMenu(
        MenuTypeEnum.Environment,
        generateGlobalPaneId(MenuTypeEnum.Environment, PageTypeEnum.Environment, params.rTypeId),
      );
    }
  });

  const collectionMenuRef = useRef<CollectionMenuRef>(null);
  const fetchCollectionTreeData = () => {
    collectionMenuRef.current?.fetchTreeData();
  };

  const handleCollapseMenu = () => {
    setCollapseMenu(!collapseMenu);
  };

  const handleMainMenuChange = (key: string) => {
    if (key === PageTypeEnum.Collection) {
      fetchCollectionTreeData();
    }
    setActiveMenu(key as MenuTypeEnum);
    collapseMenu && setCollapseMenu(false);
  };

  const addTab = () => {
    const u = uuid();
    setPages(
      {
        key: uuid(),
        title: 'New Request',
        pageType: PageTypeEnum.Request,
        menuType: MenuTypeEnum.Collection,
        isNew: true,
        paneId: generateGlobalPaneId(MenuTypeEnum.Collection, PageTypeEnum.Request, u),
        rawId: u,
      },
      'push',
    );
  };

  const removeTab = (targetKey: string) => {
    const menuType = activeMenu[0];
    const filteredPanes = pages.filter((i) => i.paneId !== targetKey);
    setPages(filteredPanes);

    if (filteredPanes.length) {
      const lastPane = JSON.parse(JSON.stringify(filteredPanes)).sort(
        (a, b) => -(a.sortIndex - b.sortIndex),
      )[0];
      setActiveMenu(filteredPanes[0].menuType, lastPane.paneId);
    } else {
      setActiveMenu(menuType);
    }
  };

  const handleTabsEdit: any = (targetKey: string, action: 'add' | 'remove') => {
    action === 'add' ? addTab() : removeTab(targetKey);
  };

  // TODO 需要应用载入时就获取环境变量，此处与envPage初始化有重复代码
  const { run: fetchEnvironmentData } = useRequest(
    () => EnvironmentService.getEnvironment({ workspaceId: params.workspaceId as string }),
    {
      ready: !!params.workspaceId,
      refreshDeps: [params.workspaceId],
      onSuccess(res) {
        setEnvironmentTreeData(res);
      },
    },
  );

  const genTabTitle = (collectionTreeData, page) => {
    // Request类型需要动态响应tittle修改
    if ([PageTypeEnum.Request, PageTypeEnum.Folder].includes(page.pageType)) {
      return (
        treeFind(collectionTreeData, (item) => item.key === parseGlobalPaneId(page.paneId)['rawId'])
          ?.title || 'New Request'
      );
    } else if ([PageTypeEnum.Environment].includes(page.pageType)) {
      return treeFind(
        environmentTreeData,
        (item) => item.id === parseGlobalPaneId(page.paneId)['rawId'],
      )?.envName;
    } else {
      return page.title;
    }
  };

  return (
    <>
      {/*AppHeader部分*/}
      <AppHeader />

      <Allotment
        css={css`
          height: calc(100vh - 74px);
        `}
      >
        <Allotment.Pane
          preferredSize={400}
          minSize={collapseMenu ? 69 : 200}
          maxSize={collapseMenu ? 69 : 600}
        >
          <WorkspacesMenu collapse={collapseMenu} />

          <MainMenu
            tabPosition='left'
            activeKey={activeMenu[0]}
            collapse={collapseMenu}
            tabBarExtraContent={
              <CollapseMenuButton
                collapse={collapseMenu}
                icon={<LeftOutlined />}
                onClick={handleCollapseMenu}
              />
            }
            onChange={handleMainMenuChange}
          >
            {MenuConfig.map((Config) => (
              // TODO 支持自定义props, ref
              <MainMenuItem
                key={Config.title}
                tab={
                  <MenuTitle icon={<Config.Icon />} title={Config.title} collapse={collapseMenu} />
                }
                menuItem={<Config.Menu />}
              />
            ))}
          </MainMenu>
        </Allotment.Pane>

        <Allotment.Pane visible>
          <EmptyWrapper
            empty={!pages.length}
            emptyContent={
              <Button type='primary' onClick={addTab}>
                New Request
              </Button>
            }
          >
            <MainTabs
              activeKey={activeMenu[1]}
              tabBarExtraContent={<EnvironmentSelect />}
              onEdit={handleTabsEdit}
              onChange={(t) => {
                setActiveMenu(activeMenu[0], t);
              }}
            >
              {pages.map((page) => {
                // TODO 支持自定义props, ref
                const TabPane = propsHydration<PageProps>(Pages, page.pageType, {
                  page,
                });
                return (
                  <MainTabPane
                    className='main-tab-page'
                    tab={genTabTitle(collectionTreeData, page)}
                    key={page.paneId}
                  >
                    <TabPane />
                  </MainTabPane>
                );
              })}
            </MainTabs>
          </EmptyWrapper>
        </Allotment.Pane>
      </Allotment>

      <AppFooter />
    </>
  );
};

export default MainBox;
