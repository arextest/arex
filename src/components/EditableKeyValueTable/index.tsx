import { CheckCircleOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Input, Space, Table, TableProps, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Updater } from 'use-immer';

import { KeyValueType } from '../../services/FileSystem.type';

const EditableKeyValueTable = styled(Table)<TableProps<KeyValueType> & { showHeader?: boolean }>`
  .ant-table-thead {
    display: ${(props) => (props.showHeader ? 'table-header-group' : 'none')};
  }
  .ant-table-cell {
    padding: ${(props) => (props.showHeader ? '4px 11px !important' : '0 1px !important')};
  }
`;

export const useColumns = (
  paramsUpdater?: Updater<KeyValueType[]>,
  editable?: boolean,
): ColumnsType<KeyValueType> => {
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

  const keyValueColumns: ColumnsType<KeyValueType> = [
    {
      title: t('env.variable', { ns: 'components' }).toUpperCase(),
      dataIndex: 'key',
      key: 'key',
      render: editable
        ? (text, record, i) => (
            <Input
              value={text}
              bordered={false}
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
              bordered={false}
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
                  icon={record.active ? <StopOutlined /> : <CheckCircleOutlined />}
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
