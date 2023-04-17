import {
  ArexFooter,
  ArexHeader,
  ArexMainContainer,
  ArexMenu,
  ArexMenuContainer,
  ArexPane,
  ArexPanesContainer,
  PanesManager,
} from 'arex-core';
import React, { useMemo } from 'react';

import { useDarkMode, useInit } from '../hooks';
import useMenusPanes from '../store/useMenusPanes';

const MainBox = () => {
  useInit();
  const { panes, activePane, setPanes, setActivePane, removePane } = useMenusPanes();
  const darkMode = useDarkMode();

  const panesItems = useMemo(
    () =>
      panes.map((p) => {
        return {
          key: p.key || '',
          label: p.title,
          children: React.createElement(
            PanesManager.getPanes().find((f: ArexPane) => p.type === f.type) || 'div',
            { data: p.data },
          ),
        };
      }),
    [panes],
  );

  return (
    <>
      <ArexHeader onDarkModeChange={darkMode.toggle} />
      <ArexMainContainer
        height={'calc(100vh - 79px)'}
        layoutId={'http'}
        vertical={false}
        layout-id='http'
        menus={
          <ArexMenuContainer
            items={[
              {
                label: 'Environment',
                key: 'Environment',
                children: (
                  <ArexMenu.Environment
                    value={activePane as string}
                    onSelect={(value) => {
                      console.log(value);
                      setPanes({
                        id: value,
                        type: 'Environment',
                        title: 'CustomPane',
                        data: { value: 'CustomPane' },
                      });
                    }}
                  />
                ),
              },
            ]}
          />
        }
        panes={
          <ArexPanesContainer
            activeKey={activePane}
            items={panesItems}
            onChange={setActivePane}
            onRemove={removePane}
          />
        }
      />
      <ArexFooter />
    </>
  );
};

export default MainBox;
