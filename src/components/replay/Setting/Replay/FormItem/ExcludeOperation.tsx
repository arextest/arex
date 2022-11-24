import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Input, message, Select, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';

import AppSettingService from '../../../../../services/AppSetting.service';
import { TooltipButton } from '../../../../index';
import { FormItemProps } from '../../Record/FormItem';

const ExcludeOperationWrapper = styled.div`
  .ant-table-cell {
    padding: 4px 11px !important;
  }
`;

type ExcludeOperationFormItem = { key: string; value: string[] };

type ExcludeOperationProps = FormItemProps<ExcludeOperationFormItem[]> & { appId: string };
const ExcludeOperation: FC<ExcludeOperationProps> = (props) => {
  const tableRowCount = useRef(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useImmer<ExcludeOperationFormItem[]>(
    props.value || [{ key: '', value: [] }],
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
      title: 'path',
      dataIndex: 'key',
      key: 'key',
      width: '50%',
      render: (text, record, i) => (
        <Input
          value={text}
          onChange={(e) => handleKeyChange(i, e.target.value)}
          style={{ borderColor: 'transparent' }}
        />
      ),
    },
    {
      title: 'value',
      dataIndex: 'value',
      key: 'value',
      width: '50%',
      render: (text, record, i) => (
        <Select
          mode='tags'
          value={text}
          tokenSeparators={[',']}
          notFoundContent={'Please enter value'}
          onChange={(value) => handleValueChange(i, value)}
          style={{ width: '100%', borderColor: 'transparent' }}
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
              state.push({ key: '', value: [] });
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
        <Space>
          <TooltipButton
            key='save'
            title={'Save'}
            type='text'
            size='small'
            icon={<SaveOutlined />}
            onClick={onSave}
          />
          <TooltipButton
            key='remove'
            type='text'
            size='small'
            title='remove'
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

  const { run: updateReplaySetting } = useRequest(AppSettingService.updateReplaySetting, {
    manual: true,
    onSuccess(res) {
      res && message.success('update success');
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
        rowKey='key'
        dataSource={value}
        pagination={false}
        showHeader={true}
        columns={columns}
      />
    </ExcludeOperationWrapper>
  );
};

export default ExcludeOperation;
