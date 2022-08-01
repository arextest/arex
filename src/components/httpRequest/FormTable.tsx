import { CheckCircleOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Input, Space, Table, TableProps, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { Updater } from 'use-immer';

import { KeyValueType } from '../../pages';

const FormTable = styled(Table)<TableProps<KeyValueType> & { showHeader?: boolean }>`
  .ant-table-thead {
    display: ${(props) => (props.showHeader ? 'table-header-group' : 'none')};
  }
  .ant-table-cell {
    padding: ${(props) => (props.showHeader ? '4px 11px !important' : '0 1px !important')};
  }
`;

export const getColumns = (
  paramsUpdater?: Updater<KeyValueType[]>,
  editable?: boolean,
): ColumnsType<KeyValueType> => {
  const { t } = useTranslation('common');
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
      title: t('key'),
      dataIndex: 'key',
      key: 'key',
      render: editable
        ? (text, record, i) => (
            <Input
              value={text}
              bordered={false}
              placeholder={t('key')}
              disabled={!record.active}
              onChange={(e) => handleChange(i, 'key', e.target.value)}
            />
          )
        : undefined,
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      render: editable
        ? (text, record, i) => (
            <Input
              value={text}
              bordered={false}
              placeholder={t('value')}
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
          title: '操作',
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

export default FormTable;
