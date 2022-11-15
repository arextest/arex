import { CodeOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Empty, Space } from 'antd';
import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { uuid } from '../../../helpers/utils';
import { FlexCenterWrapper } from '../../styledComponents';
import { ScriptBlock, ScriptBlockType } from './scriptBlocks';
import ScriptBlocksCollapse, {
  FlexRowReverse,
  ScriptBlocksCollapseProps,
} from './ScriptBlocksCollapse';

// fake data generator
const getItems = (count: number): ScriptBlock<string>[] =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: uuid(),
    type: ScriptBlockType.CustomScript,
    icon: <CodeOutlined />,
    title: '自定义脚本',
    data: '',
    disabled: false,
  }));

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const PreRequestScript: FC = () => {
  const { t } = useTranslation('common');
  const [items, setItems] = useImmer<ScriptBlock<string>[]>(getItems(3));

  const handleChange: ScriptBlocksCollapseProps['onChange'] = (id, value) => {
    setItems((state) => {
      const index = state.findIndex((item) => item.id === id);
      index >= 0 && (state[index] = value);
    });
  };

  const handleDrag = useCallback<ScriptBlocksCollapseProps['onDrag']>(
    (source, destination) => {
      setItems(reorder(items, source, destination));
    },
    [items],
  );

  const handleAdd = () => {
    const state = items.concat(getItems(1));
    setItems(state);
  };

  const handleDelete = useCallback<ScriptBlocksCollapseProps['onDelete']>(
    (id) => {
      const state = items.filter((item) => item.id !== id);
      setItems(state);
    },
    [items],
  );

  const handleSave = () => {
    // TODO
    const output = items.filter((item) => !item.disabled);
    console.log({ output });
  };

  return (
    <>
      <FlexRowReverse>
        <Space size='middle'>
          <Button size='small' type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
            {t('add')}
          </Button>

          <Button size='small' type='primary' icon={<SaveOutlined />} onClick={handleSave}>
            {t('save')}
          </Button>
        </Space>
      </FlexRowReverse>

      {items.length ? (
        <ScriptBlocksCollapse
          value={items}
          onChange={handleChange}
          onDrag={handleDrag}
          onDelete={handleDelete}
        />
      ) : (
        <FlexCenterWrapper style={{ minHeight: '400px' }}>
          <Empty description={false} />
        </FlexCenterWrapper>
      )}
    </>
  );
};

export default PreRequestScript;
