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
      panes.map((p) => {
        return {
          key: p.key || '',
          label: p.title,
          children: (
            <ErrorBoundary>
              {React.createElement(
                PanesManager.getPanes().find((f: ArexPane) => p.type === f.type) || 'div',
                { data: p.data },
              )}
            </ErrorBoundary>
          ),
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
      type: 'Environment',
      title: 'zzz',
      id: '123',
      data: { value: 'CustomPane' },
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
