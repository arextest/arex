import {
  ArexPanesType,
  copyToClipboard,
  SpaceBetweenWrapper,
  useTranslation,
} from '@arextest/arex-core';
import { App, Collapse, Drawer, Input, InputProps, List, Typography } from 'antd';
import React, {
  CompositionEventHandler,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { MenusType, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { useMenusPanes, useWorkspaces } from '@/store';
import { generateId } from '@/utils';
import { handleKeyDown, shortcuts, ShortcutsMap } from '@/utils/keybindings';

const KeyboardShortcut: FC = () => {
  const { t } = useTranslation('shortcuts');
  const { message } = App.useApp();
  const [search, setSearch] = useState<string>();
  const navPane = useNavPane();

  const {
    removePane,
    setActivePane,
    setActiveMenu,
    openKeyboardShortcut,
    toggleOpenKeyboardShortcut,
    toggleMenuCollapse,
  } = useMenusPanes();
  const { activeWorkspaceId } = useWorkspaces();

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

  const handleAction = useCallback((action: string) => {
    switch (action) {
      //  General
      // 'ctrl-u'
      case 'general.copy-link': {
        copyToClipboard(location.href);
        message.success(t('copiedToClipboard'));
        break;
      }
      // 'ctrl-/'
      case 'general.keybindings.toggle': {
        toggleOpenKeyboardShortcut();
        break;
      }

      // Request
      //   'ctrl-enter': 'request.send',
      //   'ctrl-shift-enter': 'request.send-cancel',
      //   'ctrl-s': 'request.save',
      //   'ctrl-shift-s': 'request.save-as',

      // Navigation
      // 'alt-,'
      case 'navigation.setting': {
        navPane({
          type: PanesType.SYSTEM_SETTING,
          id: 'setting',
        });
        break;
      }
      // 'alt-h'
      case 'navigation.help': {
        navPane({
          id: 'document',
          type: ArexPanesType.WEB_VIEW,
          name: t('document') as string,
          data: {
            url: 'http://arextest.com/docs/intro',
          },
        });
        break;
      }
      // 'alt-o'
      case 'navigation.workspace': {
        navPane({
          id: activeWorkspaceId,
          type: PanesType.WORKSPACE,
        });
        break;
      }

      // Pane
      // 'alt-t'
      case 'pane.new': {
        navPane({
          type: PanesType.REQUEST,
          id: generateId(12),
          icon: 'Get',
          name: 'Untitled',
        });
        break;
      }
      // 'alt-w'
      case 'pane.close': {
        removePane(undefined);
        break;
      }
      //'alt-shift-w'
      case 'pane.close-other': {
        removePane(undefined, { reversal: true });
        break;
      }
      // 'alt-left'
      case 'pane.prev': {
        setActivePane(undefined, { offset: 'left' });
        break;
      }
      // 'alt-left'
      case 'pane.next': {
        setActivePane(undefined, { offset: 'right' });
        break;
      }

      // Menu
      // 'alt-x'
      case 'menu.collapse': {
        toggleMenuCollapse();
        break;
      }
      // 'alt-up
      case 'menu.prev': {
        setActiveMenu(undefined, {
          offset: 'top',
        });
        break;
      }
      // 'alt-down
      case 'menu.next': {
        setActiveMenu(undefined, {
          offset: 'bottom',
        });
        break;
      }
      // 'alt-c
      case 'menu.collection': {
        setActiveMenu(MenusType.COLLECTION);
        break;
      }
      // 'alt-r
      case 'menu.replay': {
        setActiveMenu(MenusType.REPLAY);
        break;
      }
      // 'alt-e
      case 'menu.environment': {
        setActiveMenu(MenusType.ENVIRONMENT);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      const action = handleKeyDown(e);
      if (action) handleAction(action);
    });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Drawer
      placement='right'
      open={openKeyboardShortcut}
      title={t('shortcuts')}
      onClose={toggleOpenKeyboardShortcut}
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
                  label: <>{t(section)}</>,
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
};

export default KeyboardShortcut;
