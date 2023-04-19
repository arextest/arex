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
  PanesType,
} from 'arex-core';
import React, { useMemo } from 'react';

import { useDarkMode, useInit } from '../hooks';
import useMenusPanes from '../store/useMenusPanes';

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
  const darkMode = useDarkMode();

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

  const onMenuSelect: ArexMenuContainerProps['onSelect'] = (id, type) => {
    setPanes({
      id,
      type,
      title: 'CustomPane',
      data: { value: 'CustomPane' },
    });
  };

  const onPaneAdd: ArexPanesContainerProps['onAdd'] = () =>
    setPanes({
      // type: PanesType.DEMO,
      type: 'Demo',
      title: 'zzz',
      id: '123',
      data: { value: 'DemoPane' },
    });

  return (
    <>
      <ArexHeader onDarkModeChange={darkMode.toggle} />
      <ArexMainContainer
        collapsed={collapsed}
        menus={
          <ArexMenuContainer
            activeKey={activeMenu}
            collapsed={collapsed}
            onCollapsed={setCollapsed}
            onChange={setActiveMenu}
            onSelect={onMenuSelect}
          />
        }
        panes={
          <ArexPanesContainer
            activeKey={activePane}
            items={panesItems}
            onChange={setActivePane}
            onAdd={onPaneAdd}
            onRemove={removePane}
          />
        }
      />
      <ArexFooter />
    </>
  );
};
