import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { css, styled, useTranslation } from '@arextest/arex-core';
import { Button, Input, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';

import { focusNewLineInput } from '@/utils/table';

import { FormItemProps } from '../../Record/Standard/FormItem';

const ExcludeOperationWrapper = styled.div`
  .ant-table-cell {
    padding: 4px 11px !important;
  }
`;

type ExcludeOperationFormItem = { id: string; key: string; value: string[] };
type ExcludeOperationProps = FormItemProps<ExcludeOperationFormItem[]> & { appId: string };

const ExcludeOperation: FC<ExcludeOperationProps> = (props) => {
  const { t } = useTranslation(['components', 'common']);

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
        <Button
          danger
          type='link'
          size='small'
          icon={<DeleteOutlined />}
          onClick={() =>
            setValue?.((params) => {
              params.splice(i, 1);
            })
          }
        >
          {t('replay.delete', { ns: 'components' })}
        </Button>
      ),
    },
  ];

  useEffect(() => {
    props.onChange?.(value);
  }, [value]);

  return (
    <ExcludeOperationWrapper>
      <Table<ExcludeOperationFormItem>
        // @ts-ignore
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
              focusNewLineInput(tableRef);
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
