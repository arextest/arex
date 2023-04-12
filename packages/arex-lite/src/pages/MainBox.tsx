import { theme } from 'antd';
import {
  ArexFooter,
  ArexHeader,
  ArexMainContainer,
  ArexMenu,
  ArexMenuContainer,
  ArexPanesContainer,
} from 'arex-core';
import React from 'react';

import { useDarkMode, useInit } from '../hooks';

const MainBox = () => {
  const darkMode = useDarkMode();
  useInit();

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
        panes={
          // <ArexPanesContainer
          //   activeKey={store.globalState.activeMenu[1]}
          //   items={store.globalState.panes.map((p) => {
          //     const s = {
          //       key: p.key,
          //       label: 'd',
          //       children: paneConfig
          //         .find((f) => {
          //           return p.pageType === f.pageType;
          //         })
          //         ?.element(),
          //     };
          //     return s;
          //   })}
          // />
          <>Pane</>
        }
      />
      <ArexFooter />
    </>
  );
};

export default MainBox;
