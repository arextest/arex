import { Tabs } from 'antd';
import React, { useCallback } from 'react';
import { useImmer } from 'use-immer';

import { PreRequestScript } from '../components';
import { Authorization } from '../components/Folder';
import { reorder, ScriptBlock, ScriptBlocks } from '../components/PreRequestScript';
import { PreRequestScriptProps } from '../components/PreRequestScript/PreRequestScript';
import { uuid } from '../helpers/utils';
import { PageFC } from './index';

const FolderPage: PageFC = () => {
  const [items, setItems] = useImmer<ScriptBlock<string>[]>([]);

  const handleAdd: PreRequestScriptProps<string>['onAdd'] = (key) => {
    const block = ScriptBlocks.find((block) => block.key === key);
    const state = items.concat({
      key: uuid(),
      type: block!.key,
      icon: block!.icon,
      label: block!.key,
      data: '',
      disabled: false,
    });
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
    <div>
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
    </div>
  );
};

export default FolderPage;
