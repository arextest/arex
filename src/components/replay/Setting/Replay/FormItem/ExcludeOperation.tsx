import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Input, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';

import { TooltipButton } from '../../../../index';
import { FormItemProps } from '../../Record/FormItem';

const ExcludeOperationWrapper = styled.div`
  .ant-table-cell {
    padding: 4px 11px !important;
  }
`;

type ExcludeOperationFormItem = { key: string; value: string };

const ExcludeOperation: FC<FormItemProps<ExcludeOperationFormItem[]>> = (props) => {
  const tableRowCount = useRef(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useImmer<ExcludeOperationFormItem[]>(
    props.value || [{ key: '', value: '' }],
  );

  const handleChange = (i: number, attr: 'key' | 'value', value: string) => {
    setValue?.((params) => {
      params[i][attr] = value;
    });
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

  const columns: ColumnsType<ExcludeOperationFormItem> = [
    {
      title: 'path',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, i) => (
        <Input
          value={text}
          onChange={(e) => handleChange(i, 'key', e.target.value)}
          style={{ borderColor: 'transparent' }}
        />
      ),
    },
    {
      title: 'value (use , to split)',
      dataIndex: 'value',
      key: 'value',
      render: (text, record, i) => (
        <Input
          value={text}
          onChange={(e) => handleChange(i, 'value', e.target.value)}
          style={{ borderColor: 'transparent' }}
        />
      ),
    },
    {
      title: (
        <Button
          size='small'
          icon={<PlusOutlined />}
          onClick={() => {
            setValue((state) => {
              state.push({ key: '', value: '' });
            });
          }}
        >
          Add
        </Button>
      ),
      key: 'actions',
      width: 72,
      align: 'center',
      className: 'actions',
      render: (text, record, i) => (
        <TooltipButton
          type='text'
          size='small'
          title='remove'
          placement='left'
          icon={<DeleteOutlined />}
          onClick={() =>
            setValue?.((params) => {
              params.splice(i, 1);
            })
          }
        />
      ),
    },
  ];

  return (
    <ExcludeOperationWrapper>
      <Table<ExcludeOperationFormItem>
        ref={tableRef}
        rowKey='id'
        dataSource={value}
        pagination={false}
        showHeader={true}
        columns={columns}
      />
    </ExcludeOperationWrapper>
  );
};

export default ExcludeOperation;
