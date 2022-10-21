import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import React, { useState } from 'react';

import { AppFooter, AppHeader, WorkspacesMenu } from '../../components';
import MainMenu from './MainMenu';
import MainTabs from './MainTabs';

const MainBox = () => {
  const [collapseMenu, setCollapseMenu] = useState(false);

  const handleMainMenuChange = () => collapseMenu && setCollapseMenu(false);
  const handleCollapseMenu = () => setCollapseMenu(!collapseMenu);

  return (
    <>
      <AppHeader />

      <Allotment
        css={css`
          height: calc(100vh - 74px);
        `}
      >
        <Allotment.Pane
          preferredSize={400}
          minSize={collapseMenu ? 69 : 200}
          maxSize={collapseMenu ? 69 : 600}
        >
          <WorkspacesMenu collapse={collapseMenu} />

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
