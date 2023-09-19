import {
  ArexFooter,
  ArexHeader,
  ArexMainContainer,
  ArexMenuContainer,
  ArexMenuContainerProps,
  ArexPanesContainer,
  ArexPanesContainerProps,
  useTranslation,
} from '@arextest/arex-core';
import { MenuProps } from 'antd';
import React, { FC } from 'react';

import {
  EmptyPanePlaceholder,
  EnvironmentSelect,
  HeaderMenu,
  KeyboardShortcut,
} from '@/components';
import { PanesType } from '@/constant';
import { useInit, useNavPane } from '@/hooks';
import { useMenusPanes, useWorkspaces } from '@/store';
import { generateId } from '@/utils';

const Home: FC = () => {
  useInit();

  const {
    menuCollapsed,
    toggleMenuCollapse,
    activeMenu,
    setActiveMenu,
    panes,
    setPanes,
    switchPane,
    removeSegmentPanes,
    activePane,
    setActivePane,
    reset: resetPane,
    removePane,
  } = useMenusPanes();
  const { activeWorkspaceId } = useWorkspaces();

  const navPane = useNavPane();
  const { t } = useTranslation(['components', 'common']);

  const dropdownItems: MenuProps['items'] = [
    {
      label: t('dropdownMenu.close'),
      key: 'close',
    },
    {
      label: t('dropdownMenu.closeOther'),
      key: 'closeOther',
    },
    {
      label: t('dropdownMenu.closeAll'),
      key: 'closeAll',
    },
    // {
    //   label: t('dropdownMenu.closeUnmodified'),
    //   key: 'closeUnmodified',
    // },
    {
      label: t('dropdownMenu.closeLeft'),
      key: 'closeLeft',
    },
    {
      label: t('dropdownMenu.closeRight'),
      key: 'closeRight',
    },
  ];

  const handleMenuChange = (menuType: string) => {
    menuCollapsed && toggleMenuCollapse(false);
    setActiveMenu(menuType);
  };

  const handleMenuSelect: ArexMenuContainerProps['onSelect'] = (type, id, data) => {
    navPane({
      id,
      type,
      data,
    });
  };

  const handlePaneAdd: ArexPanesContainerProps['onAdd'] = () => {
    navPane({
      type: PanesType.REQUEST,
      id: `${activeWorkspaceId}-${generateId(12)}`,
      icon: 'Get',
      name: 'Untitled',
    });
  };

  const handleDropdownClick = (e: { key: string }, key: React.Key | null) => {
    if (!key) return;
    const paneKey = key.toString();

    switch (e.key) {
      case 'close': {
        removePane(undefined);
        break;
      }
      case 'closeOther': {
        const pane = panes.find((pane) => pane.key === paneKey);
        if (pane) setPanes([pane]);
        break;
      }
      case 'closeAll': {
        resetPane();
        break;
      }
      case 'closeLeft': {
        removeSegmentPanes(paneKey, 'left');
        break;
      }
      case 'closeRight': {
        removeSegmentPanes(paneKey, 'right');
        break;
      }
    }
  };

  const handleDragEnd: ArexPanesContainerProps['onDragEnd'] = ({ active, over }) => {
    if (active?.id && over?.id && active.id !== over?.id) {
      switchPane(String(active.id), String(over.id));
    }
  };

  return (
    <>
      <ArexHeader githubStar extra={<HeaderMenu />} />
      <ArexMainContainer
        collapsed={menuCollapsed}
        arexMenus={
          <ArexMenuContainer
            value={activePane?.id}
            activeKey={activeMenu}
            collapsed={menuCollapsed}
            onCollapsed={toggleMenuCollapse}
            onChange={handleMenuChange}
            onSelect={handleMenuSelect}
          />
        }
        arexPanes={
          <ArexPanesContainer
            activeKey={activePane?.key}
            panes={panes}
            emptyNode={<EmptyPanePlaceholder />}
            tabBarExtraContent={<EnvironmentSelect />}
            dropdownMenu={{
              items: dropdownItems,
              onClick: handleDropdownClick,
            }}
            onDragEnd={handleDragEnd}
            onChange={setActivePane}
            onAdd={handlePaneAdd}
            onRemove={removePane}
          />
        }
      />
      <ArexFooter />

      <KeyboardShortcut />
    </>
  );
};

export default Home;
