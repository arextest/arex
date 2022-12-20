import { DownOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Dropdown, Empty, Space } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { FlexCenterWrapper } from '../styledComponents';
import { ScriptBlock, ScriptBlocks } from './index';
import ScriptBlocksCollapse, {
  FlexRowReverseWrapper,
  ScriptBlocksCollapseProps,
} from './ScriptBlocksCollapse';

export interface PreRequestScriptProps<T> extends ScriptBlocksCollapseProps<T> {
  onAdd: (key: string) => void;
  onSave: (values: ScriptBlock<T>[]) => void;
}

const AddScriptBlockButton: FC<{ onAdd: (key: string) => void }> = (props) => (
  <FlexCenterWrapper style={{ padding: '8px' }}>
    <Dropdown
      menu={{
        items: ScriptBlocks,
        onClick({ key }) {
          props.onAdd(key);
        },
      }}
    >
      <Button type='primary'>
        <Space>
          <PlusOutlined />
          Add Script Block
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  </FlexCenterWrapper>
);

function PreRequestScript<T>(props: PreRequestScriptProps<T>) {
  const { value: items = [],codeSnippet } = props;
  const { t } = useTranslation('common');

  return items.length ? (
    <div>
      <FlexRowReverseWrapper>
        {/*<Button*/}
        {/*  size='small'*/}
        {/*  type='primary'*/}
        {/*  icon={<SaveOutlined />}*/}
        {/*  onClick={() => props.onSave(props.value)}*/}
        {/*>*/}
        {/*  {t('save')}*/}
        {/*</Button>*/}
      </FlexRowReverseWrapper>

      <ScriptBlocksCollapse
        value={items}
        onChange={props.onChange}
        onDrag={props.onDrag}
        onDelete={props.onDelete}
      />

      <AddScriptBlockButton onAdd={props.onAdd} />
    </div>
  ) : (
    <FlexCenterWrapper style={{ minHeight: '200px' }}>
      <Empty description={<AddScriptBlockButton onAdd={props.onAdd} />} />
    </FlexCenterWrapper>
  );
}

export default PreRequestScript;
