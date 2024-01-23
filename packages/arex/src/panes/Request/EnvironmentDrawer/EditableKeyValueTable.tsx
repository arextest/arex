import { DeleteOutlined } from '@ant-design/icons';
import { styled, useTranslation } from '@arextest/arex-core';
import { Button, Input, Space, Table, TableProps, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { Updater } from 'use-immer';

import { Icon } from '@/components';
import { EnvironmentKeyValues } from '@/services/EnvironmentService/getEnvironments';

const EditableKeyValueTable = styled(Table)<
  TableProps<EnvironmentKeyValues> & { showHeader?: boolean }
>`
  .ant-table-thead {
    display: ${(props) => (props.showHeader ? 'table-header-group' : 'none')};
  }
  .ant-table-cell {
    padding: ${(props) => (props.showHeader ? '4px 11px !important' : '0 1px !important')};
  }
`;

export const useColumns = (
  paramsUpdater?: Updater<EnvironmentKeyValues[]>,
  editable?: boolean,
): ColumnsType<EnvironmentKeyValues> => {
  const { t } = useTranslation(['common', 'components']);

  const handleChange = (i: number, attr: 'key' | 'value', value: string) => {
    paramsUpdater &&
      paramsUpdater((params) => {
        params[i][attr] = value;
      });
  };

  const handleDisable = (i: number) => {
    paramsUpdater &&
      paramsUpdater((params) => {
        params[i].active = !params[i].active;
      });
  };

  const keyValueColumns: ColumnsType<EnvironmentKeyValues> = [
    {
      title: t('env.variable', { ns: 'components' }).toUpperCase(),
      dataIndex: 'key',
      key: 'key',
      render: editable
        ? (text, record, i) => (
            <Input
              value={text}
              variant='borderless'
              placeholder={`${t('env.key', { ns: 'components' })} ${i + 1}`}
              disabled={!record.active}
              onChange={(e) => handleChange(i, 'key', e.target.value)}
            />
          )
        : undefined,
    },
    {
      title: t('env.key', { ns: 'components' }).toUpperCase(),
      dataIndex: 'value',
      key: 'value',
      render: editable
        ? (text, record, i) => (
            <Input
              value={text}
              variant='borderless'
              placeholder={`${t('env.value', { ns: 'components' })} ${i + 1}`}
              disabled={!record.active}
              onChange={(e) => handleChange(i, 'value', e.target.value)}
            />
          )
        : undefined,
    },
  ];

  return editable
    ? [
        ...keyValueColumns,
        {
          title: t('action'),
          key: 'actions',
          width: 72,
          align: 'center',
          className: 'actions',
          render: (text, record, i) => (
            <Space>
              <Tooltip title={record.active ? t('disable') : t('enable')}>
                <Button
                  type='text'
                  size='small'
                  icon={<Icon name={record.active ? 'Unlock' : 'Lock'} />}
                  onClick={() => handleDisable(i)}
                />
              </Tooltip>
              <Tooltip title={t('remove')}>
                <Button
                  type='text'
                  size='small'
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    paramsUpdater?.((params) => {
                      params.splice(i, 1);
                    })
                  }
                />
              </Tooltip>
            </Space>
          ),
        },
      ]
    : keyValueColumns;
};

export default EditableKeyValueTable;
