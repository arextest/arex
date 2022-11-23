import { Tabs } from 'antd';
import React, { useCallback } from 'react';
import { useImmer } from 'use-immer';

import { PreRequestScript } from '../components';
import { Authorization } from '../components/folder';
import { reorder, ScriptBlock, ScriptBlocks } from '../components/PreRequestScript';
import { PreRequestScriptProps } from '../components/PreRequestScript/PreRequestScript';
import { uuid } from '../helpers/utils';
import { PageFC } from './index';

const FolderPage: PageFC = () => {
  const [items, setItems] = useImmer<ScriptBlock<string>[]>([]);

  const handleAdd: PreRequestScriptProps<string>['onAdd'] = (key) => {
    const block = ScriptBlocks.find((block) => block.key === key);
    const data: ScriptBlock<string> = {
      key: uuid(),
      type: block!.type,
      icon: block!.icon,
      label: block!.label,
      data: '',
      disabled: false,
    };
    const state = items.concat(data);
    setItems(state);
  };

  const handleDelete = useCallback<PreRequestScriptProps<string>['onDelete']>(
    (id) => {
      const state = items.filter((item) => item.key !== id);
      setItems(state);
    },
    [items],
  );

  const handleDrag = useCallback<PreRequestScriptProps<string>['onDrag']>(
    (source, destination) => {
      setItems(reorder(items, source, destination));
    },
    [items],
  );

  const handleSave = () => {
    const output = items.filter((item) => !item.disabled);
    console.log({ output });
  };

  const handlePreRequestScriptChange: PreRequestScriptProps<string>['onChange'] = (id, value) => {
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
            <PreRequestScript
              value={items}
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
