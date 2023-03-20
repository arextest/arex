import { CodeOutlined } from '@ant-design/icons';
import React, { FC, useCallback, useEffect } from 'react';
import { useImmer } from 'use-immer';

import { uuid } from '../../../../helpers/utils';
import ScriptBlocks, {
  reorder,
  ScriptBlock,
  ScriptBlocksList,
  ScriptBlocksMap,
  ScriptBlockType,
} from '../../../ScriptBlocks';
import { ScriptBlocksProps } from '../../../ScriptBlocks/ScriptBlocks';

const ScriptBlocksSource = [ScriptBlocksMap[ScriptBlockType.CustomScript]];

export type PreRequestScriptProps = Omit<ScriptBlocksProps, 'onChange'> & {
  onChange: (value: { label?: string; type: string; value: string }[]) => void;
};

const PreRequestScript: FC<PreRequestScriptProps> = (props) => {
  const [items, setItems] = useImmer<ScriptBlock<string>[]>(
    props.multiple
      ? (props.value || []).map((p) => ({
          key: uuid(),
          type: p.type,
          label: p.label,
          value: p.value,
          disabled: false,
          icon: <CodeOutlined />,
        }))
      : [
          {
            key: uuid(),
            type: 'ScriptSnippets',
            icon: <CodeOutlined />,
            label: 'CustomScript',
            value: '',
            disabled: false,
          },
        ],
  );

  const handleAdd: ScriptBlocksProps<string>['onAdd'] = (key) => {
    const block = ScriptBlocksList.find((block) => block.key === key);
    const data: ScriptBlock<string> = {
      key: uuid(),
      type: block!.type,
      icon: block!.icon,
      label: block!.label,
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

  useEffect(() => {
    props.onChange(
      items
        .filter((item) => !item.disabled)
        .map((item) => ({
          label: item.label?.toString(),
          // type: item.type,
          type: '0', // 暂时写死成 number
          value: item.value,
        })),
    );
  }, [items]);

  const handlePreRequestScriptChange: ScriptBlocksProps<string>['onChange'] = ({ id, value }) => {
    // single
    if (typeof value === 'string')
      setItems((state) => {
        state[0] = {
          key: uuid(),
          type: ScriptBlockType.CustomScript,
          label: ScriptBlockType.CustomScript,
          value: value,
          disabled: false,
          icon: <CodeOutlined />,
        };
      });
    // multiple
    else
      setItems((state) => {
        const index = state.findIndex((item) => item.key === id);
        index >= 0 && (state[index] = value);
      });
  };

  return (
    <ScriptBlocks
      {...props}
      value={items}
      blocksSource={ScriptBlocksSource}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onDrag={handleDrag}
      onChange={handlePreRequestScriptChange}
    />
  );
};

export default PreRequestScript;
