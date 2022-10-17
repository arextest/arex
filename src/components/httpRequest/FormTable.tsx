import { CheckCircleOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Input, Space, Table, TableProps, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { Updater } from 'use-immer';

import { KeyValueType } from '../../pages/HttpRequest';

const FormTable = styled(Table)<TableProps<KeyValueType> & { showHeader?: boolean }>`
  .ant-table-thead {
    display: ${(props) => (props.showHeader ? 'table-header-group' : 'none')};
  }
  .ant-table-cell {
    padding: ${(props) => (props.showHeader ? '4px 11px !important' : '0 1px !important')};
  }
`;

/**
 * generate columns config
 * @param paramsUpdater
 * @param options
 */
export const useColumns = (
  paramsUpdater?: Updater<KeyValueType[]>,
  options?: {
    editable?: boolean;
    disable?: boolean;
    placeholder?: {
      key?: string;
      value?: string;
    };
  },
): ColumnsType<KeyValueType> => {
  const _disable = options?.disable ?? true;
  const { t } = useTranslation('common');

  const handleChange = (i: number, attr: 'key' | 'value', value: string) => {
    paramsUpdater?.((params) => {
      params[i][attr] = value;
    });
  };

  const handleDisable = (i: number) => {
    paramsUpdater?.((params) => {
      params[i].active = !params[i].active;
    });
  };

  const keyValueColumns: ColumnsType<KeyValueType> = [
    {
      title: t('key'),
      dataIndex: 'key',
      key: 'key',
      render: options?.editable
        ? (text, record, i) => (
            <Input
              value={text}
              bordered={false}
              placeholder={options?.placeholder?.key ?? t('key')}
              disabled={_disable && !record.active}
              onChange={(e) => handleChange(i, 'key', e.target.value)}
            />
          )
        : undefined,
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      render: options?.editable
        ? (text, record, i) => (
            <Input
              value={text}
              bordered={false}
              placeholder={options?.placeholder?.value ?? t('value')}
              disabled={_disable && !record.active}
              onChange={(e) => handleChange(i, 'value', e.target.value)}
            />
          )
        : undefined,
    },
  ];

  if (options?.editable) {
    keyValueColumns.push({
      title: '操作',
      key: 'actions',
      width: 72,
      align: 'center',
      className: 'actions',
      render: (text, record, i) => (
        <Space>
          {_disable && (
            <Tooltip title={record.active ? t('disable') : t('enable')}>
              <Button
                type='text'
                size='small'
                icon={record.active ? <StopOutlined /> : <CheckCircleOutlined />}
                onClick={() => handleDisable(i)}
              />
            </Tooltip>
          )}

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
    });
  }

  return keyValueColumns;
};

export default FormTable;
