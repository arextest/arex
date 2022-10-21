import { css } from '@emotion/react';
import { useMount, useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AppFooter, AppHeader, WorkspacesMenu } from '../../components';
import { generateGlobalPaneId } from '../../helpers/utils';
import { MenuTypeEnum } from '../../menus';
import { CollectionMenuRef } from '../../menus/CollectionMenu';
import { PageTypeEnum } from '../../pages';
import EnvironmentService from '../../services/Environment.service';
import { useStore } from '../../store';
import MainMenu from './MainMenu';
import MainTabs from './MainTabs';

const MainBox = () => {
  const nav = useNavigate();
  const params = useParams();
  const { pages, activeMenu, setActiveMenu, setEnvironmentTreeData } = useStore();

  const [collapseMenu, setCollapseMenu] = useState(false);

  // 必须和路由搭配起来，在切换的时候附着上去
  // useEffect(() => {
  //   const findActivePane = pages.find((i) => i.paneId === activeMenu[1]);
  //   if (findActivePane) {
  //     nav(
  //       `/${params.workspaceId}/workspace/${params.workspaceName}/${findActivePane.pageType}/${findActivePane.rawId}`,
  //     );
  //   }
  //   fetchEnvironmentData();
  // }, [activeMenu, pages]);

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

  const handleMainMenuChange = (key: string) => {
    if (key === PageTypeEnum.Collection) {
      fetchCollectionTreeData();
    }
    setActiveMenu(key as MenuTypeEnum);
    collapseMenu && setCollapseMenu(false);
  };

  const handleCollapseMenu = () => {
    setCollapseMenu(!collapseMenu);
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

  return (
    <>
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
            collapse={collapseMenu}
            onChange={handleMainMenuChange}
            onCollapse={handleCollapseMenu}
          />
        </Allotment.Pane>

        <Allotment.Pane visible>
          <MainTabs />
        </Allotment.Pane>
      </Allotment>

      <AppFooter />
    </>
  );
};

export default MainBox;
