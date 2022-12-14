import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import React, { useEffect, useState } from 'react';

import { AppFooter, AppHeader } from '../../components';
import { CollapseMenuKey } from '../../constant';
import { getLocalStorage, setLocalStorage } from '../../helpers/utils';
import MainMenu from './MainMenu';
import MainTabs from './MainTabs';
import useInit from '../../hooks/useInit';

const MainBox = () => {
  const [collapseMenu, setCollapseMenu] = useState(getLocalStorage<boolean>(CollapseMenuKey));

  const handleMainMenuChange = () => collapseMenu && setCollapseMenu(false);
  const handleCollapseMenu = () => {
    setCollapseMenu(!collapseMenu);
    setLocalStorage(CollapseMenuKey, !collapseMenu);
  };

  useInit();

  /**
   * 临时修复 tabs-ink-bar 在 Allotment 包裹下缺失的 bug
   * issues: https://github.com/ant-design/ant-design/issues/39190
   */
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    setShowMenu(true);
  }, []);

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
          {showMenu && (
            <MainMenu
              collapse={collapseMenu}
              onChange={handleMainMenuChange}
              onCollapse={handleCollapseMenu}
            />
          )}
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
