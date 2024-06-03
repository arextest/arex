import {
  ArexFooter,
  ArexHeader,
  ArexMenuContainer,
  ArexMenuContainerProps,
  ArexPanesContainer,
  ArexPanesContainerProps,
  useTranslation,
} from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Allotment } from 'allotment';
import { Button, Flex, MenuProps, Tooltip } from 'antd';
import React, { FC } from 'react';

import {
  EmptyPanePlaceholder,
  FooterExtraMenu,
  Icon,
  KeyboardShortcut,
  MacTrafficLightBackground,
  UserMenu,
} from '@/components';
import { CollectionNodeType, isClient, PanesType, URL_AREX } from '@/constant';
import { useCheckChrome, useInit, useNavPane } from '@/hooks';
import { useClientStore, useMenusPanes, useUserProfile, useWorkspaces } from '@/store';
import { generateId } from '@/utils';

const Home: FC = () => {
  useCheckChrome();
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
  const { organization } = useClientStore();
  const { activeWorkspaceId } = useWorkspaces();
  const { zen } = useUserProfile();

  const navPane = useNavPane();
  const [arexMainWrapperRef] = useAutoAnimate();

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
      id: `${activeWorkspaceId}-${CollectionNodeType.interface}-${generateId(12)}`,
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
    <div ref={arexMainWrapperRef}>
      {!zen && (
        <ArexHeader
          githubStar={!organization}
          logo={{ href: URL_AREX, title: organization ? `AREX.${organization}` : 'AREX' }}
          extra={<UserMenu />}
        />
      )}

      <Allotment
        css={css`
          height: ${zen ? '100vh' : 'calc(100vh - 73px)'};
        `}
      >
        <Allotment.Pane
          preferredSize={300}
          minSize={zen ? 0 : menuCollapsed ? 70 : 300}
          maxSize={zen ? 0 : menuCollapsed ? 70 : 600}
        >
          <ArexMenuContainer
            value={activePane?.id}
            activeKey={activeMenu}
            collapsed={menuCollapsed}
            onChange={handleMenuChange}
            onSelect={handleMenuSelect}
          />
        </Allotment.Pane>

        <Allotment.Pane>
          <ArexPanesContainer
            height={`calc(100vh - ${zen ? 43 : 116}px)`}
            activeKey={activePane?.key}
            panes={panes}
            emptyNode={<EmptyPanePlaceholder />}
            dropdownMenu={{
              items: dropdownItems,
              onClick: handleDropdownClick,
            }}
            onDragEnd={handleDragEnd}
            onChange={setActivePane}
            onAdd={handlePaneAdd}
            onRemove={removePane}
          />
        </Allotment.Pane>
      </Allotment>
      {!zen && (
        <ArexFooter
          leftRender={(console) => (
            <Flex align='center' style={{ height: '100%' }}>
              <Tooltip
                placement={'topLeft'}
                title={t(menuCollapsed ? 'expandSidebar' : 'collapseSidebar', { ns: 'arex-menu' })}
              >
                <Button size='small' type='link' onClick={() => toggleMenuCollapse()}>
                  <Icon
                    name='PanelLeft'
                    style={{ transform: `rotate(${menuCollapsed ? 180 : 0}deg)` }}
                  />
                </Button>
              </Tooltip>
              {process.env.NODE_ENV === 'production' && console}
            </Flex>
          )}
          rightRender={(agent) => (
            <>
              {!isClient && agent}
              <FooterExtraMenu />
            </>
          )}
        />
      )}
      <MacTrafficLightBackground />
      <KeyboardShortcut />
    </div>
  );
};

export default Home;
