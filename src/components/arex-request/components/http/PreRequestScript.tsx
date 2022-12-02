import React, { useCallback } from 'react';
import { useImmer } from 'use-immer';

import { uuid } from '../../../../helpers/utils';
import { PreRequestScript } from '../../../index';
import { reorder, ScriptBlock, ScriptBlocks } from '../../../PreRequestScript';
import { PreRequestScriptProps } from '../../../PreRequestScript/PreRequestScript';

const HttpPreRequestScript = () => {
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
    <PreRequestScript
      value={items}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onDrag={handleDrag}
      onChange={handlePreRequestScriptChange}
      onSave={handleSave}
    />
  );
};

export default HttpPreRequestScript;
