import styled from '@emotion/styled';
import { Button, Dropdown, MenuProps, TabsProps } from 'antd';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { DraggableTabs, EnvironmentSelect } from '../../components';
import { EmptyWrapper } from '../../components/styledComponents';
import { treeFind } from '../../helpers/collection/util';
import { generateGlobalPaneId, parseGlobalPaneId, uuid } from '../../helpers/utils';
import { MenusType } from '../../menus';
import Pages, { PagesType } from '../../pages';
import { NodeList } from '../../services/Collection.service';
import { Page, useStore } from '../../store';

const MainTabs = () => {
  const nav = useNavigate();
  const params = useParams();

  const {
    pages,
    activeMenu,
    setPages,
    removePage,
    resetPanes,
    setActiveMenu,
    environmentTreeData,
    collectionTreeData,
  } = useStore();

  const addTab = () => {
    const u = uuid();
    setPages(
      {
        key: u,
        title: 'New Request',
        pageType: PagesType.Request,
        menuType: MenusType.Collection,
        isNew: true,
        data: undefined,
        paneId: generateGlobalPaneId(MenusType.Collection, PagesType.Request, u),
        rawId: u,
      },
      'push',
    );
  };

  const rightClickItems: (id: string) => MenuProps['items'] = (id) => [
    {
      label: 'Close this tab',
      key: 'closeThisTab',
      onClick: () => removePage(id),
    },
    {
      label: 'Close other tab',
      key: 'closeOtherTab',
      onClick: () => setPages(pages.filter((page) => page.paneId === id)),
    },
    {
      label: 'Close all tab',
      key: 'closeAllTab',
      onClick: resetPanes,
    },
  ];

  const handleTabsEdit: TabsProps['onEdit'] = (targetKey, action: 'add' | 'remove') => {
    action === 'add' ? addTab() : removePage(targetKey as string);
  };

  const genTabTitle = useCallback(
    (collectionTreeData: NodeList[], page: Page<any>) => {
      // Request类型需要动态响应tittle修改
      if ([PagesType.Request, PagesType.Folder].includes(page.pageType)) {
        return (
          treeFind(
            collectionTreeData,
            (item) => item.key === parseGlobalPaneId(page.paneId)['rawId'],
          )?.title || 'New Request'
        );
      } else if ([PagesType.Environment].includes(page.pageType)) {
        return treeFind(
          environmentTreeData,
          (item) => item.id === parseGlobalPaneId(page.paneId)['rawId'],
        )?.envName;
      } else {
        return page.title;
      }
    },
    [environmentTreeData],
  );

  const tabsItems = useMemo<TabsProps['items']>(
    () =>
      pages.map((page) => {
        return {
          forceRender: true,
          label: (
            <Dropdown menu={{ items: rightClickItems(page.paneId) }} trigger={['contextMenu']}>
              <span>{genTabTitle(collectionTreeData, page)}</span>
            </Dropdown>
          ),
          key: page.paneId,
          children: React.createElement(Pages[page.pageType], { page }),
        };
      }),
    [pages, genTabTitle, collectionTreeData],
  );

  // 必须和路由搭配起来，在切换的时候附着上去
  useEffect(() => {
    const findActivePane = pages.find((i) => i.paneId === activeMenu[1]);
    if (findActivePane) {
      nav(
        `/${params.workspaceId}/workspace/${params.workspaceName}/${findActivePane.pageType}/${findActivePane.rawId}`,
      );
    }
  }, [activeMenu, pages]);

  return (
    <EmptyWrapper
      empty={!pages.length}
      description={
        <Button type='primary' onClick={addTab}>
          New Request
        </Button>
      }
    >
      <MainTabsWrapper
        className='main-tabs'
        activeKey={activeMenu[1]}
        tabBarExtraContent={<EnvironmentSelect />}
        items={tabsItems}
        onEdit={handleTabsEdit}
        onChange={(t) => {
          setActiveMenu(activeMenu[0], t);
        }}
      />
    </EmptyWrapper>
  );
};

const MainTabsWrapper = styled((props: TabsProps) => {
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
      color: ${(props) => props.theme.colorTextSecondary}!important;
    }
    :hover {
      .ant-tabs-tab-btn {
        color: ${(props) => props.theme.colorText}!important;
      }
    }
  }

  .ant-tabs-tab-with-remove {
    padding: 6px 12px !important;
    // 添加高亮条 tabs-ink-bar
    // 注意当前的作用范围很广，目前的作用对象为工作区所有的可编辑可删除卡片式 Tab
    // .ant-tabs-tab-with-remove 类是为了避免污染一般的 Tabs
    &.ant-tabs-tab-active {
      :after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: ${(props) => props.theme.colorPrimary};
        transition: all 0.2s ease-in-out;
      }
    }
    .ant-tabs-tab-remove {
      margin-left: 0;
      padding-right: 0;
    }
  }

  .main-tabs {
    overflow: auto;
    height: inherit;
    padding: 0 16px;
  }

  .ant-tabs-nav-operations {
    margin-bottom: 0 !important;
    .ant-tabs-nav-more {
      padding: 8px 12px;
      border: 1px solid ${(props) => props.theme.colorBorderSecondary};
      border-bottom-color: ${(props) => props.theme.colorBorder};
      border-radius: ${(props) => props.theme.borderRadius}px
        ${(props) => props.theme.borderRadius}px 0 0;
    }
    .ant-tabs-nav-add {
      margin-left: -1px;
      border-bottom-color: ${(props) => props.theme.colorBorderSecondary};
    }
  }

  .ant-tabs-nav-more {
    height: 36px;
    border-left: #000c17 1px solid;
  }
  .ant-tabs-content {
    height: 100%;
    .ant-tabs-tabpane {
      height: inherit;
      padding: 0 16px;
      overflow: auto;
    }
  }
`;

export default MainTabs;
