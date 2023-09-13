import { SpaceBetweenWrapper, useTranslation } from '@arextest/arex-core';
import { Collapse, Drawer, Input, InputProps, List, Typography } from 'antd';
import React, {
  CompositionEventHandler,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { useMenusPanes } from '@/store';
import { generateId } from '@/utils';
import { handleKeyDown, shortcuts, ShortcutsMap } from '@/utils/keybindings';

const KeyboardShortcut: FC = () => {
  const { t } = useTranslation('shortcuts');
  const [search, setSearch] = useState<string>();
  const navPane = useNavPane();

  const { openKeyboardShortcut, toggleOpenKeyboardShortcut } = useMenusPanes();

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

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      const action = handleKeyDown(e);
      if (action) {
        console.log('boundAction: ', action);
        handleAction(action);
      }
    });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAction = useCallback((action: string) => {
    switch (action) {
      case 'general.keybindings.toggle': {
        toggleOpenKeyboardShortcut();
        break;
      }
      case 'pane.new': {
        navPane({
          type: PanesType.REQUEST,
          id: generateId(12),
          icon: 'Get',
          name: 'Untitled',
        });
      }
    }
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
