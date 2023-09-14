import {
  ArexPanesType,
  copyToClipboard,
  SpaceBetweenWrapper,
  useTranslation,
} from '@arextest/arex-core';
import { App, Collapse, Drawer, Input, InputProps, List, Typography } from 'antd';
import React, { CompositionEventHandler, useEffect, useMemo, useRef, useState } from 'react';

import { MenusType, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { useMenusPanes, useWorkspaces } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';
import { generateId } from '@/utils';
import { handleKeyDown, shortcuts, ShortcutsMap } from '@/utils/keybindings';

const KeyboardShortcut = React.memo(() => {
  const { t } = useTranslation('shortcuts');
  const { message } = App.useApp();
  const [search, setSearch] = useState<string>();
  const navPane = useNavPane();

  const {
    activePane,
    removePane,
    setActivePane,
    setActiveMenu,
    openKeyboardShortcut,
    toggleOpenKeyboardShortcut,
    toggleMenuCollapse,
  } = useMenusPanes();
  const { activeWorkspaceId } = useWorkspaces();
  const latestActivePaneKey = useRef(activePane?.key);
  useEffect(() => {
    latestActivePaneKey.current = activePane?.key;
  }, [activePane]);

  const inputLock = useRef(false);
  const shortcutsFiltered = useMemo<ShortcutsMap>(() => {
    if (!search) return shortcuts;

    return Object.keys(shortcuts).reduce<ShortcutsMap>((dataSource, section) => {
      const shortcutsFiltered = shortcuts[section].filter((shortcut) =>
        t(shortcut.label).toLowerCase().includes(search.toLowerCase()),
      );
      if (shortcutsFiltered.length) dataSource[section] = shortcutsFiltered;
      return dataSource;
    }, {});
  }, [search, t]);
  const handleComposition: CompositionEventHandler = (ev) => {
    if (ev.type === 'compositionend') {
      inputLock.current = false;
      setSearch(ev.data);
    } else {
      inputLock.current = true;
    }
  };
  const handleChange: InputProps['onChange'] = (e) => {
    if (!inputLock.current) {
      setSearch(e.target.value);
    }
  };

  const handleClose = () => {
    toggleOpenKeyboardShortcut();
    setSearch('');
  };

  // Handler function for keyboard press events,
  // the corresponding key for the event is configured in @/utils/keybindings.bindings

  const handleAction = (action: string, activePaneKey?: string) => {
    switch (action) {
      //  General
      // 'ctrl-u': 'general.copy-link'
      case 'general.copy-link': {
        copyToClipboard(location.href);
        message.success(t('copiedToClipboard'));
        break;
      }
      // 'ctrl-/': 'general.keybindings.toggle':
      case 'general.keybindings.toggle': {
        handleClose();
        break;
      }

      // Request
      // 'ctrl-enter': 'request.send',
      case 'request.send': {
        const { type } = decodePaneKey(activePaneKey);
        if (type === PanesType.REQUEST) {
          (
            document.querySelector(
              `#arex-pane-wrapper-${activePaneKey} #arex-request-send-btn`,
            ) as HTMLElement
          )?.click?.();
        }
        break;
      }
      // 'ctrl-shift-enter': 'request.send-cancel',
      case 'request.send-cancel': {
        const { type } = decodePaneKey(activePaneKey);
        if (type === PanesType.REQUEST) {
          (
            document.querySelector(
              `#arex-pane-wrapper-${activePaneKey} #arex-request-cancel-btn`,
            ) as HTMLElement
          )?.click?.();
        }
        break;
      }
      // 'ctrl-s': 'request.save',
      case 'request.save': {
        const { type } = decodePaneKey(activePaneKey);
        if (type === PanesType.REQUEST) {
          (
            document.querySelector(
              `#arex-pane-wrapper-${activePaneKey} #arex-request-save-btn`,
            ) as HTMLElement
          )?.click?.();
        }
        break;
      }
      // 'ctrl-shift-s': 'request.save-as',
      case 'request.save-as': {
        const { type } = decodePaneKey(activePaneKey);
        if (type === PanesType.REQUEST) {
          (
            document.querySelector(
              `#arex-pane-wrapper-${activePaneKey} #arex-request-saveas-btn`,
            ) as HTMLElement
          )?.click?.();
        }
        break;
      }

      // Replay
      // 'alt-r': 'replay.refresh-report',
      case 'replay.refresh-report': {
        const { type } = decodePaneKey(activePaneKey);
        if (type === PanesType.REPLAY) {
          (
            document.querySelector(
              `#arex-pane-wrapper-${activePaneKey} #arex-replay-refresh-report-btn`,
            ) as HTMLElement
          )?.click?.();
        }
        break;
      }
      // 'alt-d': 'replay.record-detail'
      case 'replay.record-detail': {
        const { type } = decodePaneKey(activePaneKey);
        if (type === PanesType.REPLAY) {
          (
            document.querySelector(
              `#arex-pane-wrapper-${activePaneKey} #arex-replay-record-detail-btn`,
            ) as HTMLElement
          )?.click?.();
        }
        break;
      }
      // 'alt-shift-,': 'replay.app-setting'
      case 'replay.app-setting': {
        const { type } = decodePaneKey(activePaneKey);
        if (type === PanesType.REPLAY) {
          (
            document.querySelector(
              `#arex-pane-wrapper-${activePaneKey} #arex-replay-app-setting-btn`,
            ) as HTMLElement
          )?.click?.();
        }
        break;
      }
      // 'alt-p': 'replay.create-plan'
      case 'replay.create-plan': {
        const { type } = decodePaneKey(activePaneKey);
        if (type === PanesType.REPLAY) {
          (
            document.querySelector(
              `#arex-pane-wrapper-${activePaneKey} #arex-replay-create-plan-btn`,
            ) as HTMLElement
          )?.click?.();
        }
        break;
      }

      // ReplayCase
      // 'alt-b': 'replayCase.replay-report',
      case 'replayCase.replay-report': {
        const { type } = decodePaneKey(activePaneKey);
        if (type === PanesType.REPLAY_CASE) {
          (
            document.querySelector(
              `#arex-pane-wrapper-${activePaneKey} #arex-replay-case-replay-report-btn`,
            ) as HTMLElement
          )?.click?.();
        }
        break;
      }

      // Navigation
      // 'alt-,': 'navigation.setting'
      case 'navigation.setting': {
        navPane({
          type: PanesType.SYSTEM_SETTING,
          id: 'setting',
        });
        break;
      }
      // 'alt-h': 'navigation.help'
      case 'navigation.help': {
        navPane({
          id: 'document',
          type: ArexPanesType.WEB_VIEW,
          name: t('document') as string,
          data: {
            url: `http://www.arextest.com/docs/chapter1/get-started`,
          },
        });
        break;
      }
      // 'alt-o': 'navigation.workspace'
      case 'navigation.workspace': {
        navPane({
          id: activeWorkspaceId,
          type: PanesType.WORKSPACE,
        });
        break;
      }

      // Pane
      // 'alt-t': 'pane.new'
      case 'pane.new': {
        navPane({
          type: PanesType.REQUEST,
          id: generateId(12),
          icon: 'Get',
          name: 'Untitled',
        });
        break;
      }
      // 'alt-w': 'pane.close'
      case 'pane.close': {
        removePane(undefined);
        break;
      }
      //'alt-shift-w': 'pane.close-other'
      case 'pane.close-other': {
        removePane(undefined, { reversal: true });
        break;
      }
      // 'alt-left': 'pane.prev'
      case 'pane.prev': {
        setActivePane(undefined, { offset: 'left' });
        break;
      }
      // 'alt-left': 'pane.next'
      case 'pane.next': {
        setActivePane(undefined, { offset: 'right' });
        break;
      }

      // Menu
      // 'alt-x': 'menu.collapse'
      case 'menu.collapse': {
        toggleMenuCollapse();
        break;
      }
      // 'alt-up: 'menu.prev'
      case 'menu.prev': {
        setActiveMenu(undefined, {
          offset: 'top',
        });
        break;
      }
      // 'alt-down: 'menu.next'
      case 'menu.next': {
        setActiveMenu(undefined, {
          offset: 'bottom',
        });
        break;
      }
      // 'alt-c: 'menu.collection'
      case 'menu.collection': {
        setActiveMenu(MenusType.COLLECTION);
        break;
      }
      // 'alt-r: 'menu.replay'
      case 'menu.replay': {
        setActiveMenu(MenusType.REPLAY);
        break;
      }
      // 'alt-e: 'menu.environment'
      case 'menu.environment': {
        setActiveMenu(MenusType.ENVIRONMENT);
        break;
      }
    }
  };

  useEffect(
    () => {
      window.addEventListener('keydown', (e) => {
        const action = handleKeyDown(e);
        if (action) handleAction(action, latestActivePaneKey.current);
      });
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    },
    // 如果依赖 activePane 将导致重复渲染
    [latestActivePaneKey],
  );

  return (
    <Drawer
      placement='right'
      open={openKeyboardShortcut}
      title={t('shortcuts')}
      onClose={handleClose}
      headerStyle={{ height: '46px', padding: '7px', flex: 'none' }}
    >
      <Input
        onChange={handleChange}
        onCompositionStart={handleComposition}
        onCompositionEnd={handleComposition}
        placeholder={t('searchPlaceholder') as string}
        style={{ marginRight: '8px' }}
      />

      <List
        size='large'
        dataSource={Object.keys(shortcutsFiltered)}
        renderItem={(section) => (
          <List.Item style={{ padding: '12px 0' }}>
            <Collapse
              bordered={false}
              key={section}
              size='small'
              defaultActiveKey={section}
              items={[
                {
                  key: section,
                  label: <Typography.Text strong>{t(section)}</Typography.Text>,
                  children: shortcutsFiltered[section].map((shortcut, key) => (
                    <SpaceBetweenWrapper key={key} style={{ marginBottom: '4px' }}>
                      <Typography.Text>{t(shortcut.label)}</Typography.Text>
                      <div>
                        {shortcut.keys.map((key, index) => (
                          <Typography.Text keyboard key={index} style={{ marginLeft: '4px' }}>
                            {key}
                          </Typography.Text>
                        ))}
                      </div>
                    </SpaceBetweenWrapper>
                  )),
                },
              ]}
              style={{ width: '100%' }}
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
});

export default KeyboardShortcut;
