import { DownOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import ScriptSnippets, { ScriptSnippetsProps } from '../ScriptSnippets';
import { EmptyWrapper, FlexCenterWrapper } from '../styledComponents';
import { ScriptBlock, ScriptBlocksList, ScriptBlocksType } from './index';
import ScriptBlocksCollapse, {
  FlexRowReverseWrapper,
  ScriptBlocksCollapseProps,
} from './ScriptBlocksCollapse';

export interface ScriptBlocksProps<T = string>
  extends Omit<ScriptBlocksCollapseProps<T>, 'onChange'> {
  multiple?: boolean; // true-代码块模式, false-编辑器模式
  snippets?: ScriptSnippetsProps['snippets']; // 脚本模版 编辑器模式模式生效
  buttonTitle?: string; // 新增代码块按钮title（代码块模式生效
  blocksSource?: ScriptBlocksType<any>[];
  onAdd?: (key: string) => void;
  onSave?: (values: ScriptBlock<T>[] | string) => void;
  onChange: (data: { id?: string; value: ScriptBlock<any> | string }) => void;
}

const AddScriptBlockButton: FC<{
  title?: string;
  blocksSource: ScriptBlocksProps['blocksSource'];
  onAdd?: (key: string) => void;
}> = (props) => (
  <FlexCenterWrapper style={{ padding: '8px', height: '100px' }}>
    <Dropdown
      menu={{
        items: props.blocksSource,
        onClick({ key }) {
          props.onAdd?.(key);
        },
      }}
    >
      <Button type='primary'>
        <Space>
          <PlusOutlined />
          {props.title}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  </FlexCenterWrapper>
);

function ScriptBlocks<T>(props: ScriptBlocksProps<T>) {
  const { t } = useTranslation(['common', 'components']);
  const {
    value = [],
    blocksSource = ScriptBlocksList,
    buttonTitle = t('http.add_script_block', { ns: 'components' }),
  } = props;

  return (
    <EmptyWrapper
      empty={!!props.multiple && !value.length}
      description={
        <AddScriptBlockButton title={buttonTitle} blocksSource={blocksSource} onAdd={props.onAdd} />
      }
    >
      {props.onSave && (
        <FlexRowReverseWrapper>
          <Button
            size='small'
            type='primary'
            icon={<SaveOutlined />}
            onClick={() => props.onSave?.(props.value)}
          >
            {t('save')}
          </Button>
        </FlexRowReverseWrapper>
      )}

      {props.multiple ? (
        <>
          <ScriptBlocksCollapse
            value={value}
            onChange={(id, value) => props.onChange({ id, value })}
            onDrag={props.onDrag}
            onDelete={props.onDelete}
          />
          <AddScriptBlockButton
            title={buttonTitle}
            blocksSource={blocksSource}
            onAdd={props.onAdd}
          />
        </>
      ) : (
        <ScriptSnippets
          language='javascript'
          snippets={props.snippets}
          value={value?.[0]?.value as string | undefined}
          onChange={(value) => props.onChange({ value })}
        />
      )}
    </EmptyWrapper>
  );
}

export default ScriptBlocks;
