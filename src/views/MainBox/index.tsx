import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import React, { useState } from 'react';

import { AppFooter, AppHeader } from '../../components';
import { CollapseMenuKey } from '../../constant';
import { getLocalStorage, setLocalStorage } from '../../helpers/utils';
import { useCheckChrome, useInit } from '../../hooks';
import MainMenu from './MainMenu';
import MainTabs from './MainTabs';

const MainBox = () => {
  useCheckChrome();
  useInit();

  const [collapseMenu, setCollapseMenu] = useState(getLocalStorage<boolean>(CollapseMenuKey));

  const handleMainMenuChange = () => collapseMenu && setCollapseMenu(false);
  const handleCollapseMenu = () => {
    setCollapseMenu(!collapseMenu);
    setLocalStorage(CollapseMenuKey, !collapseMenu);
  };

  return (
    <>
      <AppHeader />

      <Allotment
        css={css`
          height: calc(100vh - 73px);
        `}
      >
        <Allotment.Pane
          preferredSize={400}
          minSize={collapseMenu ? 69 : 200}
          maxSize={collapseMenu ? 69 : 600}
        >
          <MainMenu
            collapse={collapseMenu}
            onChange={handleMainMenuChange}
            onCollapse={handleCollapseMenu}
          />
        </Allotment.Pane>

        <Allotment.Pane visible>
          <MainTabs />
        </Allotment.Pane>
      </Allotment>

      <AppFooter />
    </>
  );
};

export default MainBox;
