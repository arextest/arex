import { css } from '@emotion/react';
import { useMount } from 'ahooks';
import { Button, theme } from 'antd';
import {
  AppFooter,
  AppHeader,
  AppPaneLayout,
  AppSidenav,
  CollectionMenu,
  EnvironmentMenu,
  MainTabs,
  ReplayMenu,
} from 'arex-common';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { PageTypeEnum } from '../constant';
import useDarkMode from '../hooks/use-dark-mode';
import useInit from '../hooks/useInit';
import mockCollectionTreeData from '../mocks/mockCollectionTreeData';
import paneConfig from '../panes/config';
import { useCustomNavigate } from '../router/useCustomRouter';
import { MainContext } from '../store/content/MainContent';
import { x } from './mockData';
// import {ReplayMenu} from "arex-common/src";
// import {CollectionMenu} from "arex-common";
// import {AppHeader} from '../components/app/Header';
// import AppPaneLayout from '../components/app/PaneLayout';
// import AppSidenav from '../components/app/Sidenav';
// import MainTabs from '../components/panes/MainTabs';
// import { MenuTypeEnum, PageTypeEnum } from '../constant';
// import { getMenuTypeByPageType } from '../helpers/utils';
// import useDarkMode from '../hooks/use-dark-mode';
// import { useCustomNavigate } from '../router/useCustomRouter';
// import request from '../services/request';
// import { MainContext } from '../store/content/MainContent';
function collectionOriginalTreeToAntdTreeData(tree: any, nodeList: any[] = []): any[] {
  const nodes = tree;
  Object.keys(nodes).forEach((value, index) => {
    nodeList.push({
      id: nodes[value].infoId,
      children: [],
      // 自定义
      title: nodes[value].nodeName,
      key: nodes[value].infoId,
      nodeType: nodes[value].nodeType,
      method: nodes[value].method,
      // isLeaf: nodes[value].nodeType === 2||nodes[value].children==null
      // icon: iconMap[nodes[value].nodeType],
    });
    if (nodes[value].children && Object.keys(nodes[value].children).length > 0) {
      collectionOriginalTreeToAntdTreeData(nodes[value].children, nodeList[index].children);
    }
  });
  return nodeList;
}

const { useToken } = theme;
const MainBox = () => {
  // console.log(mockCollectionTreeData,'mockCollectionTreeData')
  // const darkMode = useDarkMode();
  // const { i18n, t } = useTranslation();
  // const
  const [workspaces, setWorkspaces] = useState([]);
  const params = useParams();
  const theme = useToken();
  const { store, dispatch } = useContext(MainContext);
  const customNavigate = useCustomNavigate();
  console.log(theme, 'theme');
  const darkMode = useDarkMode();
  useInit();
  function handleCollectionMenuClick(key: any, node: any) {
    const pageType = ['', PageTypeEnum.Request, PageTypeEnum.Case, PageTypeEnum.Folder][
      node.nodeType
    ];
    customNavigate(`/${params.workspaceId}/workspace/${params.workspaceName}/${pageType}/${key}`);
  }

  function handleReplayMenuClick() {
    customNavigate(`/${params.workspaceId}/workspace/${params.workspaceName}/${'replay'}/${'key'}`);
  }
  return (
    <div>
      <AppHeader
        onClickDarkMode={(c: boolean) => {
          console.log(c);
          darkMode.toggle(c);
        }}
      />
      <AppPaneLayout
        height={'calc(100vh - 79px)'}
        layoutId={'http'}
        vertical={false}
        layout-id='http'
        primary={
          <AppSidenav
            items={[
              {
                label: 'Collection',
                key: 'Collection',
                children: (
                  <CollectionMenu
                    value={'activeMenu[1]'}
                    collectionTreeData={collectionOriginalTreeToAntdTreeData(
                      mockCollectionTreeData.roots,
                    )}
                    onSelect={handleCollectionMenuClick}
                    onClickRunCompare={() => {
                      customNavigate(
                        `/${params.workspaceId}/workspace/${
                          params.workspaceName
                        }/${'run'}/${'key'}`,
                      );
                    }}
                    onClickRunTest={() => {
                      console.log('1123');
                    }}
                  />
                ),
              },
              {
                label: 'Replay',
                key: 'Replay',
                children: (
                  <ReplayMenu value={'EnvironmentMenu[1]'} onSelect={handleReplayMenuClick} />
                ),
              },
              {
                label: 'Environment',
                key: 'Environment',
                children: (
                  <EnvironmentMenu
                    value={'EnvironmentMenu[1]'}
                    onSelect={() => {
                      console.log();
                    }}
                  />
                ),
              },
            ]}
          />
        }
        secondary={
          <MainTabs
            activeKey={store.globalState.activeMenu[1]}
            items={store.globalState.panes.map((p) => {
              const s = {
                key: p.key,
                label: 'd',
                children: paneConfig
                  .find((f) => {
                    return p.pageType === f.pageType;
                  })
                  ?.element(),
              };
              console.log(s);
              return s;
            })}
          />
        }
      />
      <AppFooter />
    </div>
  );
};

export default MainBox;
