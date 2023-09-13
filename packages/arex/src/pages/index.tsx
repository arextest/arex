import {
  ArexFooter,
  ArexHeader,
  ArexMainContainer,
  ArexMenuContainer,
  ArexMenuContainerProps,
  ArexPanesContainer,
  ArexPanesContainerProps,
  getLocalStorage,
  useTranslation,
} from '@arextest/arex-core';
import { useKeyPress, useRequest } from 'ahooks';
import { App, MenuProps } from 'antd';
import React, { FC, useMemo } from 'react';

import { EnvironmentSelect, HeaderMenu } from '@/components';
import { EMAIL_KEY, PanesType } from '@/constant';
import { useInit, useNavPane } from '@/hooks';
import { FileSystemService } from '@/services';
import { useMenusPanes, useWorkspaces } from '@/store';
import { generateId } from '@/utils';

const Home: FC = () => {
  useInit();

  const {
    collapsed,
    setCollapsed,
    activeMenu,
    setActiveMenu,
    panes,
    setPanes,
    switchPane,
    removeSegmentPanes,
    activePane,
    setActivePane,
    reset: resetPane,
    removePane,
  } = useMenusPanes();
  const { activeWorkspaceId, workspaces, getWorkspaces, setActiveWorkspaceId } = useWorkspaces();

  const navPane = useNavPane();
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);
  const userName = getLocalStorage<string>(EMAIL_KEY) as string;

  const workspacesOptions = useMemo(
    () =>
      workspaces.map((workspace) => ({
        value: workspace.id,
        label: workspace.workspaceName,
      })),
    [workspaces],
  );

  const dropdownItems: MenuProps['items'] = [
    {
      label: t('dropdownMenu.close'),
      key: 'close',
    },
    {
      label: t('dropdownMenu.closeOther'),
      key: 'closeOther',
    },
    {
      label: t('dropdownMenu.closeAll'),
      key: 'closeAll',
    },
    // {
    //   label: t('dropdownMenu.closeUnmodified'),
    //   key: 'closeUnmodified',
    // },
    {
      label: t('dropdownMenu.closeLeft'),
      key: 'closeLeft',
    },
    {
      label: t('dropdownMenu.closeRight'),
      key: 'closeRight',
    },
  ];

  const { run: createWorkspace } = useRequest(FileSystemService.createWorkspace, {
    manual: true,
    onSuccess: (res) => {
      if (res.success) {
        message.success(t('workSpace.createSuccess'));
        resetPane();
        getWorkspaces(res.workspaceId);
      }
    },
  });

  const handleMenuChange = (menuType: string) => {
    collapsed && setCollapsed(false);
    setActiveMenu(menuType);
  };

  const handleMenuSelect: ArexMenuContainerProps['onSelect'] = (type, id, data) => {
    navPane({
      id,
      type,
      data,
    });
  };

  const handlePaneAdd: ArexPanesContainerProps['onAdd'] = () => {
    navPane({
      type: PanesType.REQUEST,
      id: generateId(12),
      icon: 'Get',
      name: 'Untitled',
    });
  };

  const handleAddWorkspace = (workspaceName: string) => {
    createWorkspace({ userName, workspaceName });
  };

  const handleEditWorkspace = (workspaceId: string) => {
    navPane({
      type: PanesType.WORKSPACE,
      id: workspaceId,
    });
  };

  const handleDropdownClick = (e: { key: string }, key: React.Key | null) => {
    if (!key) return;
    const paneKey = key.toString();

    switch (e.key) {
      case 'close': {
        removePane(paneKey);
        break;
      }
      case 'closeOther': {
        const pane = panes.find((pane) => pane.key === paneKey);
        if (pane) setPanes([pane]);
        break;
      }
      case 'closeAll': {
        resetPane();
        break;
      }
      case 'closeLeft': {
        removeSegmentPanes(paneKey, 'left');
        break;
      }
      case 'closeRight': {
        removeSegmentPanes(paneKey, 'right');
        break;
      }
    }
  };

  const handleDragEnd: ArexPanesContainerProps['onDragEnd'] = ({ active, over }) => {
    if (active?.id && over?.id && active.id !== over?.id) {
      switchPane(String(active.id), String(over.id));
    }
  };

  useKeyPress(
    ['meta.t', 'meta.alt.t'],
    () => {
      handlePaneAdd();
    },
    { useCapture: true },
  );
  useKeyPress(
    ['meta.w', 'meta.alt.w'],
    () => {
      activePane?.key && removePane(activePane?.key);
    },
    { useCapture: true },
  );

  return (
    <>
      <ArexHeader githubStar extra={<HeaderMenu />} />
      <ArexMainContainer
        collapsed={collapsed}
        arexMenus={
          <ArexMenuContainer
            value={activePane?.id}
            activeKey={activeMenu}
            collapsed={collapsed}
            workspaceMenuProps={{
              value: activeWorkspaceId,
              options: workspacesOptions,
              onChange: setActiveWorkspaceId,
              onAdd: handleAddWorkspace,
              onEdit: handleEditWorkspace,
              // extra?: ReactNode;
            }}
            onCollapsed={setCollapsed}
            onChange={handleMenuChange}
            onSelect={handleMenuSelect}
          />
        }
        arexPanes={
          <ArexPanesContainer
            activeKey={activePane?.key}
            panes={panes}
            tabBarExtraContent={<EnvironmentSelect />}
            dropdownMenu={{
              items: dropdownItems,
              onClick: handleDropdownClick,
            }}
            onDragEnd={handleDragEnd}
            onChange={setActivePane}
            onAdd={handlePaneAdd}
            onRemove={removePane}
          />
        }
      />
      <ArexFooter />
    </>
  );
};

export default Home;
