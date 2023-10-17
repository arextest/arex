import { useTranslation } from '@arextest/arex-core';
import { Button, Space, Typography } from 'antd';
import React, { FC, useMemo } from 'react';

import { CollectionNodeType, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { useWorkspaces } from '@/store';
import { generateId } from '@/utils';
import { shortcuts } from '@/utils/keybindings';

const shortcutsTipList = ['general.keybindings.toggle', 'navigation.help'];

const EmptyPanePlaceholder: FC = () => {
  const { t } = useTranslation(['components', 'shortcuts']);
  const navPane = useNavPane();
  const { activeWorkspaceId } = useWorkspaces();

  const handlePaneAdd = () => {
    navPane({
      type: PanesType.REQUEST,
      id: `${activeWorkspaceId}-${CollectionNodeType.interface}-${generateId(12)}`,
      icon: 'Get',
      name: 'Untitled',
    });
  };

  const shortcutsTip = useMemo(
    () =>
      shortcutsTipList.map((action, index) => {
        const [section] = action.split('.');

        const shortcut = shortcuts[section].find((shortcut) => shortcut.label === action);
        if (!shortcut) return null;

        return (
          <div key={index} style={{ display: 'flex', flexFlow: 'row nowrap' }}>
            <div style={{ flex: 1, marginRight: '8px' }}>
              <Typography.Text type='secondary' style={{ float: 'right' }}>
                {t(shortcut.label, { ns: 'shortcuts' })}
              </Typography.Text>
            </div>

            <div style={{ marginLeft: '8px', whiteSpace: 'nowrap' }}>
              {shortcut.keys.map((key, index) => (
                <Typography.Text keyboard key={index} type='secondary'>
                  {key}
                </Typography.Text>
              ))}
            </div>
          </div>
        );
      }),
    [shortcutsTipList, t],
  );
  return (
    <div>
      <div className={'new-request-pane'} style={{ margin: '8px 0 16px 0' }}>
        <Button type='primary' onClick={handlePaneAdd} style={{ marginTop: '8px' }}>
          {t('collection.new_request')}
        </Button>
      </div>

      <Space direction='vertical'>{shortcutsTip}</Space>
    </div>
  );
};

export default EmptyPanePlaceholder;
