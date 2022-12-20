import { CodeOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button, Input } from 'antd';
import React, { useCallback, useContext, useEffect } from 'react';
import { useImmer } from 'use-immer';

import { uuid } from '../../../../helpers/utils';
import { PreRequestScript } from '../../../index';
import { reorder, ScriptBlock, ScriptBlocks, ScriptBlockType } from '../../../PreRequestScript';
import { PreRequestScriptProps } from '../../../PreRequestScript/PreRequestScript';
import SingleScriptInput from '../../../SingleScriptInput';
import { HttpContext } from '../../index';

const HttpPreRequestScript = ({ mode, value, onChange,codeSnippet }) => {
  const [items, setItems] = useImmer<ScriptBlock<string>[]>([]);
  useEffect(() => {
    if (mode === 'single' && value.length === 0) {
      const data: ScriptBlock<string> = {
        key: uuid(),
        type: 'ScriptSnippets',
        icon: <CodeOutlined />,
        label: 'CustomScript',
        data: '',
        disabled: false,
      };
      setItems([data]);
    } else {
      setItems(
        value.map((p) => {
          return {
            key: uuid(),
            type: ScriptBlockType.CustomScript,
            label: ScriptBlockType.CustomScript,
            data: p.value,
            disabled: false,
            icon: <CodeOutlined />,
          };
        }),
      );
    }
  }, []);
  const handleAdd: PreRequestScriptProps<string>['onAdd'] = (key, initData = '') => {
    const block = ScriptBlocks.find((block) => block.key === key);
    const data: ScriptBlock<string> = {
      key: uuid(),
      type: block!.type,
      icon: block!.icon,
      label: block!.label,
      data: initData,
      disabled: false,
    };
    console.log(data, 'data');
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

  useEffect(() => {
    const output = items.filter((item) => !item.disabled);

    onChange(
      output.map((i) => {
        return {
          icon: '',
          label: 'CustomScript',
          type: 0,
          value: i.data,
        };
      }),
    );
  }, [items]);

  const handlePreRequestScriptChange: PreRequestScriptProps<string>['onChange'] = (id, value) => {
    setItems((state) => {
      const index = state.findIndex((item) => item.key === id);
      index >= 0 && (state[index] = value);
    });
  };

  return (
    <div>
      <div
        css={css`
          display: ${mode === 'single' ? 'none' : 'block'};
        `}
      >
        <PreRequestScript
          value={items}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onDrag={handleDrag}
          onChange={handlePreRequestScriptChange}
          onSave={handleSave}
        />
      </div>
      <div
        css={css`
          display: ${mode === 'single' ? 'block' : 'none'};
        `}
      >
        <SingleScriptInput
          value={items.map((i) => i.data).join('\n')}
          onChange={(value) => {
            setItems((state) => {
              if (state[0] !== undefined) {
                state[0].data = value;
              }
            });
          }}
          codeSnippet={codeSnippet}
        ></SingleScriptInput>
      </div>
    </div>
  );
};

export default HttpPreRequestScript;
