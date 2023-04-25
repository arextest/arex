import {
  ArexFooter,
  ArexHeader,
  ArexMainContainer,
  ArexMenuContainer,
  ArexMenuContainerProps,
  ArexPanesContainer,
  ArexPanesContainerProps,
} from 'arex-core';
import React, { useMemo } from 'react';

import HeaderMenu from '../components/HeaderMenu';
import { PanesType } from '../constant';
import { useInit } from '../hooks';
import { useMenusPanes, useWorkspaces } from '../store';

export default () => {
  useInit();

  const {
    collapsed,
    setCollapsed,
    activeMenu,
    setActiveMenu,
    panes,
    setPanes,
    activePane,
    setActivePane,
    removePane,
  } = useMenusPanes();
  const { activeWorkspaceId, workspaces, setActiveWorkspaceId } = useWorkspaces();

  const workspacesOptions = useMemo(
    () =>
      workspaces.map((workspace) => ({
        value: workspace.id,
        label: workspace.name,
      })),
    [workspaces],
  );

  const handleMenuSelect: ArexMenuContainerProps['onSelect'] = (id, type) => {
    setPanes({
      id,
      type,
    });
  };

  const handlePaneAdd: ArexPanesContainerProps['onAdd'] = () =>
    setPanes({
      type: PanesType.DEMO,
      // id: Math.random().toString(36).substring(2),
      id: 'Untitled',
      icon: 'Get',
      data: { value: 'DemoPane' },
    });

  return (
    <>
      <ArexHeader menu={<HeaderMenu />} />
      <ArexMainContainer
        collapsed={collapsed}
        arexMenus={
          <ArexMenuContainer
            activeKey={activeMenu}
            collapsed={collapsed}
            workspaceMenuProps={{
              value: activeWorkspaceId,
              options: workspacesOptions,
              onChange: setActiveWorkspaceId,
              // extra?: ReactNode;
              // onAdd?(name: string): void;
              // onEdit?(id: string): void;
            }}
            onCollapsed={setCollapsed}
            onChange={setActiveMenu}
            onSelect={handleMenuSelect}
          />
        }
        arexPanes={
          <ArexPanesContainer
            activeKey={activePane?.key}
            panes={panes}
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
