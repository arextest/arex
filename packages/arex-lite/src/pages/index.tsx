import {
  ArexFooter,
  ArexHeader,
  ArexMainContainer,
  ArexMenuContainer,
  ArexMenuContainerProps,
  ArexPane,
  ArexPaneManager,
  ArexPanesContainer,
  ArexPanesContainerProps,
  ErrorBoundary,
} from 'arex-core';
import React, { useMemo } from 'react';

import HeaderMenu from '../components/HeaderMenu';
import { PanesType } from '../constant';
import { useInit } from '../hooks';
import { useMenusPanes } from '../store';
import { getPaneKey } from '../store/useMenusPanes';

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

  const panesItems = useMemo(
    () =>
      panes.map((pane) => {
        const Pane = ArexPaneManager.getPanes().find(
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
      title: getPaneKey({ id, type }),
    });
  };

  const handlePaneAdd: ArexPanesContainerProps['onAdd'] = () =>
    setPanes({
      type: PanesType.DEMO,
      title: 'Untitled',
      id: Math.random().toString(36).substring(2),
      data: { value: 'DemoPane' },
    });

  return (
    <>
      <ArexHeader menu={<HeaderMenu />} />
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
