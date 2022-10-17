import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Input, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { FC, useEffect } from 'react';
import { useImmer } from 'use-immer';

import { FormItemProps } from './index';

const ExcludeOperationWrapper = styled.div`
  .ant-table-cell {
    padding: 4px 11px !important;
  }
`;

type ExcludeOperationFormItem = { key: string; value: string };

const ExcludeOperation: FC<FormItemProps<ExcludeOperationFormItem[]>> = (props) => {
  const [value, setValue] = useImmer<ExcludeOperationFormItem[]>(
    props.value || [{ key: '', value: '' }],
  );

  const handleChange = (i: number, attr: 'key' | 'value', value: string) => {
    setValue?.((params) => {
      params[i][attr] = value;
    });
  };

  useEffect(() => props.onChange?.(value), [value]);

  const columns: ColumnsType<ExcludeOperationFormItem> = [
    {
      title: 'key',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, i) => (
        <Input
          value={text}
          bordered={false}
          onChange={(e) => handleChange(i, 'key', e.target.value)}
        />
      ),
    },
    {
      title: 'value',
      dataIndex: 'value',
      key: 'value',
      render: (text, record, i) => (
        <Input
          value={text}
          bordered={false}
          onChange={(e) => handleChange(i, 'value', e.target.value)}
        />
      ),
    },
    {
      title: (
        <Button
          type='text'
          size='small'
          icon={<PlusOutlined />}
          onClick={() =>
            setValue((state) => {
              state.push({ key: '', value: '' });
            })
          }
        >
          Add
        </Button>
      ),
      key: 'actions',
      width: 72,
      align: 'center',
      className: 'actions',
      render: (text, record, i) => (
        <Tooltip title={'remove'}>
          <Button
            type='text'
            size='small'
            icon={<DeleteOutlined />}
            onClick={() =>
              setValue?.((params) => {
                params.splice(i, 1);
              })
            }
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <ExcludeOperationWrapper>
      <Table<ExcludeOperationFormItem>
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
