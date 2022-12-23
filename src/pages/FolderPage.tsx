import { Tabs } from 'antd';
import React, { useCallback, useState } from 'react';
import { useImmer } from 'use-immer';

import { ScriptBlocks } from '../components';
import { Authorization } from '../components/Folder';
import { reorder, ScriptBlock, ScriptBlocksMap, ScriptBlockType } from '../components/ScriptBlocks';
import { ScriptBlocksProps } from '../components/ScriptBlocks/ScriptBlocks';
import { uuid } from '../helpers/utils';
import { PageFC } from './index';

const ScriptBlocksSource = [ScriptBlocksMap[ScriptBlockType.CustomScript]];

const FolderPage: PageFC = () => {
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
      data: '',
      disabled: false,
    };
    const state = items.concat(data);
    setItems(state);
  };

  const handleDelete = useCallback<ScriptBlocksProps<string>['onDelete']>(
    (id) => {
      const state = items.filter((item) => item.key !== id);
      setItems(state);
    },
    [items],
  );

  const handleDrag = useCallback<ScriptBlocksProps<string>['onDrag']>(
    (source, destination) => {
      setItems(reorder(items, source, destination));
    },
    [items],
  );

  const handleSave = () => {
    const output = items.filter((item) => !item.disabled);
    console.log({ output });
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
          label: 'Authorization',
          children: <Authorization />,
        },
        {
          key: 'pre-requestScript',
          label: 'Pre-request Script',
          children: (
            <ScriptBlocks
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
          label: 'Tests',
          children: 'Content of Tests',
          disabled: true,
        },
      ]}
    />
  );
};

export default FolderPage;
