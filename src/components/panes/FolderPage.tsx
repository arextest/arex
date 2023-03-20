import { Tabs } from 'antd';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { uuid } from '../../helpers/utils';
import { Authorization } from '../Folder';
import { ScriptBlocks } from '../index';
import { reorder, ScriptBlock, ScriptBlocksMap, ScriptBlockType } from '../ScriptBlocks';
import { ScriptBlocksProps } from '../ScriptBlocks/ScriptBlocks';
import { PageFC } from './index';

const ScriptBlocksSource = [ScriptBlocksMap[ScriptBlockType.CustomScript]];

const FolderPage: PageFC = () => {
  const { t } = useTranslation(['components', 'page']);
  const [script, setScript] = useState<string>();
  const [items, setItems] = useImmer<ScriptBlock<string>[]>([]);

  const handleAdd: ScriptBlocksProps<string>['onAdd'] = (key) => {
    const block = ScriptBlocksSource.find((block) => block.key === key);
    if (!block) return;

    const data: ScriptBlock<string> = {
      key: uuid(),
      type: block.type,
      icon: block.icon,
      label: block.label,
      value: '',
      disabled: false,
    };
    const state = items.concat(data);
    setItems(state);
  };

  const handleDelete = useCallback<Required<ScriptBlocksProps<string>>['onDelete']>(
    (id) => {
      const state = items.filter((item) => item.key !== id);
      setItems(state);
    },
    [items],
  );

  const handleDrag = useCallback<Required<ScriptBlocksProps<string>>['onDrag']>(
    (source, destination) => {
      setItems(reorder(items, source, destination));
    },
    [items],
  );

  const handleSave = () => {
    const output = items.filter((item) => !item.disabled);
  };

  const handlePreRequestScriptChange: ScriptBlocksProps<string>['onChange'] = ({ id, value }) => {
    if (typeof value === 'string') setScript(value);
    else
      setItems((state) => {
        const index = state.findIndex((item) => item.key === id);
        index >= 0 && (state[index] = value);
      });
  };

  return (
    <Tabs
      defaultActiveKey='authorization'
      items={[
        {
          key: 'authorization',
          label: t('http.authorization', { ns: 'components' }),
          children: <Authorization />,
        },
        {
          key: 'pre-requestScript',
          label: t('http.pre-requestScript', { ns: 'components' }),
          children: (
            <ScriptBlocks
              multiple
              value={items}
              blocksSource={ScriptBlocksSource}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onDrag={handleDrag}
              onChange={handlePreRequestScriptChange}
              onSave={handleSave}
            />
          ),
        },
        {
          key: 'tests',
          label: t('folderPage.tests', { ns: 'page' }),
          children: 'Content of Tests',
          disabled: true,
        },
      ]}
    />
  );
};

export default FolderPage;
