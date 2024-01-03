import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { css, styled, TooltipButton, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Input, Select, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';

import { ConfigService } from '@/services';

import { FormItemProps } from '../../Record/FormItem';

const ExcludeOperationWrapper = styled.div`
  .ant-table-cell {
    padding: 4px 11px !important;
  }
`;

type ExcludeOperationFormItem = { id: string; key: string; value: string[] };
type ExcludeOperationProps = FormItemProps<ExcludeOperationFormItem[]> & { appId: string };

const ExcludeOperation: FC<ExcludeOperationProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const tableRowCount = useRef(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useImmer<ExcludeOperationFormItem[]>(
    props.value || [{ id: Date.now().toString(), key: '', value: [] }],
  );

  const handleKeyChange = (i: number, key: string) => {
    setValue?.((params) => {
      params[i].key = key;
    });
  };

  const handleValueChange = (i: number, value: string[]) => {
    setValue?.((params) => {
      params[i].value = value;
    });
  };

  const columns: ColumnsType<ExcludeOperationFormItem> = [
    {
      title: t('appSetting.path'),
      dataIndex: 'key',
      key: 'key',
      render: (text, record, i) => (
        <Input
          value={text}
          onChange={(e) => handleKeyChange(i, e.target.value)}
          style={{ borderColor: 'transparent' }}
        />
      ),
    },
    {
      title: t('appSetting.value'),
      dataIndex: 'value',
      key: 'value',
      render: (text, record, i) => (
        <Select
          mode='tags'
          value={text}
          tokenSeparators={[',']}
          notFoundContent={t('appSetting.emptyValue')}
          onChange={(value) => handleValueChange(i, value)}
          style={{ width: '100%', borderColor: 'transparent' }}
        />
      ),
    },
    {
      title: t('action', { ns: 'common' }),
      key: 'actions',
      width: 80,
      align: 'center',
      className: 'actions',
      render: (text, record, i) => (
        <Space>
          <TooltipButton
            key='save'
            type='text'
            size='small'
            icon={<SaveOutlined />}
            title={t('save', { ns: 'common' })}
            onClick={onSave}
          />
          <TooltipButton
            key='remove'
            type='text'
            size='small'
            title={t('remove', { ns: 'common' })}
            icon={<DeleteOutlined />}
            onClick={() =>
              setValue?.((params) => {
                params.splice(i, 1);
              })
            }
          />
        </Space>
      ),
    },
  ];

  const { run: updateReplaySetting } = useRequest(ConfigService.updateReplaySetting, {
    manual: true,
    onSuccess(res) {
      res && message.success(t('message.updateSuccess', { ns: 'common' }));
    },
  });

  const onSave = () => {
    const params = {
      appId: props.appId,
      excludeOperationMap: value.reduce<{ [key: string]: string[] }>((map, cur) => {
        map[cur['key']] = cur['value'];
        return map;
      }, {}),
    };
    updateReplaySetting(params);
  };

  useEffect(() => {
    props.onChange?.(value);
    if (tableRowCount.current !== value.length) {
      // focus last row key input
      const path = [6, 2, 2];
      let inputRef: ChildNode | null | undefined = tableRef?.current;
      path.forEach((level, i) => {
        for (let x = level; x > 0; x--) {
          if (!inputRef) break;
          inputRef = inputRef?.[i % 2 ? 'lastChild' : 'firstChild'];
        }
      });
      // @ts-ignore
      inputRef?.focus?.({
        cursor: 'start',
      });

      tableRowCount.current = value.length;
    }
  }, [value]);

  return (
    <ExcludeOperationWrapper>
      <Table<ExcludeOperationFormItem>
        ref={tableRef}
        rowKey='id'
        dataSource={value}
        pagination={false}
        showHeader={true}
        columns={columns}
        footer={() => (
          <Button
            block
            type='text'
            size='small'
            icon={<PlusOutlined />}
            onClick={() => {
              setValue((state) => {
                state.push({ id: '', key: '', value: [] });
              });
            }}
          >
            {t('add', { ns: 'common' })}
          </Button>
        )}
        css={css`
          .ant-table-footer {
            padding: 4px;
          }
        `}
      />
    </ExcludeOperationWrapper>
  );
};

export default ExcludeOperation;
