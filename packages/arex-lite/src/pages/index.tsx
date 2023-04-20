import {
  ArexFooter,
  ArexHeader,
  ArexMainContainer,
  ArexMenuContainer,
  ArexMenuContainerProps,
  ArexPane,
  ArexPanesContainer,
  ArexPanesContainerProps,
  ErrorBoundary,
  PanesManager,
} from 'arex-core';
import React, { useMemo } from 'react';

import { useInit } from '../hooks';
import { useMenusPanes, useUserProfile } from '../store';

export default () => {
  useInit();

  const { setTheme } = useUserProfile();
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

  const panesItems = useMemo(
    () =>
      panes.map((pane) => {
        const Pane = PanesManager.getPanes().find(
          (p: ArexPane) => pane.type === p.type,
        ) as ArexPane;
        return {
          key: pane.key || '',
          label: [Pane.icon, pane.title],
          children: <ErrorBoundary>{React.createElement(Pane, { data: pane.data })}</ErrorBoundary>,
        };
      }),
    [panes],
  );

  const handleMenuSelect: ArexMenuContainerProps['onSelect'] = (id, type) => {
    setPanes({
      id,
      type,
      title: 'CustomPane',
      data: { value: 'CustomPane' },
    });
  };

  const handlePaneAdd: ArexPanesContainerProps['onAdd'] = () =>
    setPanes({
      // type: PanesType.DEMO,
      type: 'Demo',
      title: 'zzz',
      id: '123',
      data: { value: 'DemoPane' },
    });

  return (
    <>
      <ArexHeader onThemeChange={setTheme} />
      <ArexMainContainer
        collapsed={collapsed}
        menus={
          <ArexMenuContainer
            activeKey={activeMenu}
            collapsed={collapsed}
            onCollapsed={setCollapsed}
            onChange={setActiveMenu}
            onSelect={handleMenuSelect}
          />
        }
        panes={
          <ArexPanesContainer
            activeKey={activePane}
            items={panesItems}
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
