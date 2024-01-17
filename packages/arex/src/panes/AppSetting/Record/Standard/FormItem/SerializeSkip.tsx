import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { css, FlexCenterWrapper, SmallTextButton, useTranslation } from '@arextest/arex-core';
import { Button, Input, Space, Table, theme } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { FC, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';

import { FormItemProps } from '@/panes/AppSetting/Record/Standard/FormItem/index';
import { SerializeSkipInfo } from '@/services/ConfigService';

const SerializeSkip: FC<FormItemProps<SerializeSkipInfo[]>> = (props) => {
  const { token } = theme.useToken();
  const { t } = useTranslation('components');
  const [dataSource, setDataSource] = useImmer(props.value || []);

  const inputCssObject = useMemo(
    () => css`
      height: 26px;
      border-radius: ${token.borderRadius}px;
      border: 1px solid transparent;
      transition: all 250ms;
      :focus {
        border: 1px solid ${token.colorPrimaryBorder};
      }
      :hover {
        border: 1px solid ${token.colorBorder};
      }
      :hover:focus {
        border: 1px solid ${token.colorPrimaryBorderHover};
      }
    `,
    [token],
  );

  useEffect(() => {
    props.onChange?.(dataSource);
  }, [dataSource]);

  const columns = useMemo<ColumnsType<SerializeSkipInfo>>(
    () => [
      {
        title: t('appSetting.fullClassName'),
        dataIndex: 'fullClassName',
        render: (value, record, index) => (
          <Input
            css={inputCssObject}
            bordered={false}
            value={value}
            onChange={(e) =>
              setDataSource((state) => {
                state[index]['fullClassName'] = e.target.value;
              })
            }
          />
        ),
      },
      {
        title: t('appSetting.fieldName'),
        dataIndex: 'fieldName',
        render: (value, record, index) => (
          <Input
            css={inputCssObject}
            bordered={false}
            value={value}
            onChange={(e) =>
              setDataSource((state) => {
                state[index]['fieldName'] = e.target.value;
              })
            }
          />
        ),
      },
      {
        title: t('action', { ns: 'common' }),
        align: 'center',
        width: '15%',
        render: (value, record, index) => (
          <Button
            danger
            type='link'
            size='small'
            icon={<DeleteOutlined />}
            onClick={() =>
              setDataSource((state) => {
                state.splice(index, 1);
              })
            }
          >
            {t('replay.delete', { ns: 'components' })}
          </Button>
        ),
      },
    ],
    [t],
  );

  const handleAddItem = () => {
    setDataSource((state) => {
      state.push({
        fullClassName: '',
        fieldName: '',
      });
    });
  };

  return (
    <Table
      size='small'
      columns={columns}
      dataSource={dataSource}
      footer={() => (
        <FlexCenterWrapper>
          <Button block size='small' type='text' icon={<PlusOutlined />} onClick={handleAddItem}>
            {t('add', { ns: 'common' })}
          </Button>
        </FlexCenterWrapper>
      )}
      css={css`
        .ant-table-footer {
          padding: 4px;
        }
      `}
    />
  );
};

export default SerializeSkip;
