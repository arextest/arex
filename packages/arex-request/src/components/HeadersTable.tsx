import { CheckCircleOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import { styled } from '@arextest/arex-core';
import { Button, Input, Space, Table, TableProps, theme, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { cloneDeep } from 'lodash';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ArexRESTHeader } from '../types';

export interface HeaderData extends ArexRESTHeader {
  id?: string;
}

export interface HeaderTableProps extends Omit<TableProps<HeaderData>, 'columns'> {
  showHeader?: boolean;
  editable?: boolean;
  onEdit?: (data?: HeaderData[]) => void;
}

const HeaderTableWrapper = styled.div<{ showHeader?: boolean; editable?: boolean }>`
  .ant-table-thead {
    display: ${(props) => (props.showHeader ? 'table-header-group' : 'none')};
  }
  .ant-table-cell {
    padding: ${(props) => (props.editable ? '0 1px !important' : undefined)};
  }
`;

const HeadersTable: FC<HeaderTableProps> = (props) => {
  const { editable, showHeader, dataSource, ...restProps } = props;

  const { token } = theme.useToken();
  const { t } = useTranslation();

  const columns = useMemo<ColumnsType<HeaderData>>(() => {
    const handleChange = (i: number, attr: 'key' | 'value', value: string) => {
      const clone = (cloneDeep(dataSource) || []) as HeaderData[];
      clone[i][attr] = value;
      props.onEdit?.(clone);
    };

    const handleDisable = (i: number) => {
      const clone = (cloneDeep(dataSource) || []) as HeaderData[];
      clone[i].active = !clone[i].active;
      props.onEdit?.(clone);
    };

    const keyValueColumns: ColumnsType<HeaderData> = [
      {
        title: t('count.key'),
        dataIndex: 'key',
        key: 'key',
        width: '50%',
        render: props.editable
          ? (text, record, i) => (
              <Input
                value={text}
                bordered={false}
                placeholder={'key'}
                disabled={!record.active}
                onChange={(e) => handleChange(i, 'key', e.target.value)}
              />
            )
          : undefined,
      },
      {
        title: t('count.value'),
        dataIndex: 'value',
        key: 'value',
        width: '50%',
        render: props.editable
          ? (text, record, i) => (
              <Input
                value={text}
                bordered={false}
                placeholder={'value'}
                disabled={!record.active}
                onChange={(e) => handleChange(i, 'value', e.target.value)}
              />
            )
          : undefined,
      },
    ];

    return props.editable
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
                <Tooltip title={record.active ? t('action.turn_off') : t('action.turn_on')}>
                  <Button
                    style={{ color: token.colorSuccess }}
                    type='text'
                    size='small'
                    icon={record.active ? <CheckCircleOutlined /> : <StopOutlined />}
                    onClick={() => handleDisable(i)}
                  />
                </Tooltip>
                <Tooltip title={t('action.remove')}>
                  <Button
                    style={{ color: token.colorError }}
                    type='text'
                    size='small'
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      const clone = (cloneDeep(dataSource) as HeaderData[]) || [];
                      clone.splice(i, 1);
                      props.onEdit?.(clone);
                    }}
                  />
                </Tooltip>
              </Space>
            ),
          },
        ]
      : keyValueColumns;
  }, [dataSource, props.editable, t, token]);

  return (
    <HeaderTableWrapper editable={editable} showHeader={showHeader}>
      <Table columns={columns} dataSource={dataSource} {...restProps} />
    </HeaderTableWrapper>
  );
};

export default HeadersTable;
