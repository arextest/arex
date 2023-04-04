import { theme } from 'antd';
import {
  ArexFooter,
  ArexHeader,
  ArexMainBox,
  ArexMenu,
  ArexSideMenu,
  PanesWrapper,
} from 'arex-core';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { PageTypeEnum } from '../constant';
import useDarkMode from '../hooks/use-dark-mode';
import useInit from '../hooks/useInit';
import mockCollectionTreeData from '../mocks/mockCollectionTreeData';
import paneConfig from '../panes/config';
import { useCustomNavigate } from '../router/useCustomRouter';
import { MainContext } from '../store/content/MainContent';

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
    <>
      <ArexHeader onDarkModeChange={darkMode.toggle} />
      <ArexMainBox
        height={'calc(100vh - 79px)'}
        layoutId={'http'}
        vertical={false}
        layout-id='http'
        primary={
          <ArexSideMenu
            items={[
              {
                label: 'Collection',
                key: 'Collection',
                children: (
                  <ArexMenu.Collection
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
                label: 'Environment',
                key: 'Environment',
                children: (
                  <ArexMenu.Environment
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
          <PanesWrapper
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
      <ArexFooter />
    </>
  );
};

export default MainBox;
