import {
  ArexFooter,
  ArexHeader,
  ArexMainContainer,
  ArexMenuContainer,
  ArexPane,
  ArexPanesContainer,
  ErrorBoundary,
  PanesManager,
} from 'arex-core';
import React, { useMemo } from 'react';

import { useDarkMode, useInit } from '../hooks';
import useMenusPanes from '../store/useMenusPanes';

const Index = () => {
  useInit();
  const { panes, activePane, activeMenu, setActiveMenu, setPanes, setActivePane, removePane } =
    useMenusPanes();
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

  return (
    <>
      <ArexHeader onDarkModeChange={darkMode.toggle} />
      <ArexMainContainer
        menus={
          <ArexMenuContainer
            activeKey={activeMenu}
            onChange={setActiveMenu}
            onSelect={(id, type) => {
              setPanes({
                id,
                type,
                title: 'CustomPane',
                data: { value: 'CustomPane' },
              });
            }}
          />
        }
        panes={
          <ArexPanesContainer
            activeKey={activePane}
            items={panesItems}
            onChange={setActivePane}
            onAdd={() =>
              setPanes({
                type: 'Environment',
                title: 'zzz',
                id: '123',
                data: { value: 'CustomPane' },
              })
            }
            onRemove={removePane}
          />
        }
      />
      <ArexFooter />
    </>
  );
};

export default Index;
