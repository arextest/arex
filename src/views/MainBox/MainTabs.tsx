import styled from '@emotion/styled';
import { Button, Empty, TabPaneProps, Tabs, TabsProps } from 'antd';
import React, { ReactNode } from 'react';

import { DraggableTabs, EnvironmentSelect } from '../../components';
import { MenuTypeEnum } from '../../constant';
import { treeFind } from '../../helpers/collection/util';
import { generateGlobalPaneId, parseGlobalPaneId, uuid } from '../../helpers/utils';
import Pages, { PageFC, PageTypeEnum } from '../../pages';
import { Page, PageData, useStore } from '../../store';

const { TabPane } = Tabs;

const MainTabs = () => {
  const { pages, activeMenu, setPages, setActiveMenu, environmentTreeData, collectionTreeData } =
    useStore();

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

  const handleTabsEdit: any = (targetKey: string, action: 'add' | 'remove') => {
    action === 'add' ? addTab() : removeTab(targetKey);
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

  const genTabTitle = (collectionTreeData, page: Page<any>) => {
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
    <EmptyWrapper
      empty={!pages.length}
      emptyContent={
        <Button type='primary' onClick={addTab}>
          New Request
        </Button>
      }
    >
      <MainTabsWrapper
        activeKey={activeMenu[1]}
        tabBarExtraContent={<EnvironmentSelect />}
        onEdit={handleTabsEdit}
        onChange={(t) => {
          setActiveMenu(activeMenu[0], t);
        }}
      >
        {pages.map((page) => {
          // TODO 支持自定义props, ref
          const Page: PageFC<PageData> = Pages[page.pageType];
          return (
            <MainTabPane
              className='main-tab-page'
              tab={genTabTitle(collectionTreeData, page)}
              key={page.paneId}
            >
              <Page page={page} />
            </MainTabPane>
          );
        })}
      </MainTabsWrapper>
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

const MainTabPane = styled(TabPane)<TabPaneProps>`
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

export default MainTabs;
