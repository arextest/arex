import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, Button, Input, Popconfirm, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Updater, useImmer } from 'use-immer';

import AppSettingService from '../../../../services/AppSetting.service';
import { DynamicClass } from '../../../../services/AppSetting.type';
import TooltipButton from '../../../TooltipButton';

export type DynamicClassesEditableTableProps = {
  appId: string;
};

const EDIT_ROW_KEY = '__edit_row__';
const InitRowData = {
  id: EDIT_ROW_KEY,
  fullClassName: '',
  methodName: '',
  parameterTypes: '',
};

const DynamicClassesEditableTable: FC<DynamicClassesEditableTableProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['common', 'components']);

  const [editableRow, setEditableRow] = useState<string>();
  const [fullClassNameInputStatus, setFullClassNameInputStatus] = useState<
    '' | 'error' | 'warning'
  >('');
  const isEditableRow = useCallback<(id?: string) => boolean>(
    (id) => id === editableRow || id === EDIT_ROW_KEY,
    [editableRow],
  );

  const [dataSource, setDataSource] = useImmer<DynamicClass[]>([]);

  const columns = (paramsUpdater: Updater<DynamicClass[]>): ColumnsType<DynamicClass> => {
    const handleChange = (attr: keyof DynamicClass, value: string) => {
      paramsUpdater((params) => {
        const index = params.findIndex((item) => isEditableRow(item.id));
        // @ts-ignore
        params[index][attr] = value;
      });
    };

    return [
      {
        title: t('appSetting.fullClassName', { ns: 'components' }),
        dataIndex: 'fullClassName',
        key: 'fullClassName',
        render: (text, record) =>
          isEditableRow(record.id) ? (
            <Input
              value={text}
              status={fullClassNameInputStatus}
              onChange={(e) => {
                setFullClassNameInputStatus('');
                handleChange('fullClassName', e.target.value);
              }}
            />
          ) : (
            text
          ),
      },
      {
        title: t('appSetting.methodName', { ns: 'components' }),
        dataIndex: 'methodName',
        key: 'methodName',
        render: (text, record) =>
          isEditableRow(record.id) ? (
            <Input value={text} onChange={(e) => handleChange('methodName', e.target.value)} />
          ) : (
            text
          ),
      },
      {
        title: t('appSetting.parameterTypes', { ns: 'components' }),
        dataIndex: 'parameterTypes',
        key: 'parameterTypes',
        render: (text, record) =>
          isEditableRow(record.id) ? (
            <Input value={text} onChange={(e) => handleChange('parameterTypes', e.target.value)} />
          ) : (
            text
          ),
      },
      {
        title: t('action'),
        key: 'actions',
        width: 72,
        align: 'center',
        className: 'actions',
        render: (text, record) => (
          <Space>
            {isEditableRow(record.id) ? (
              <TooltipButton
                title={t('cancel')}
                icon={<CloseOutlined />}
                onClick={() => reload({ appId: props.appId })}
              />
            ) : (
              <TooltipButton
                title={t('edit')}
                icon={<EditOutlined />}
                onClick={() => {
                  // 防止某一行在编辑未保存状态下意外开始编辑新的一行数据，导致夹带未保存的数据
                  reload({ appId: props.appId });
                  setEditableRow(record.id);
                }}
              />
            )}

            {isEditableRow(record.id) ? (
              <TooltipButton
                title={t('save')}
                icon={<SaveOutlined />}
                onClick={() => handleSave(record)}
              />
            ) : (
              <Popconfirm
                title={t('appSetting.delConfirmText', { ns: 'components' })}
                onConfirm={() => {
                  if (record.id === EDIT_ROW_KEY) {
                    setDataSource((state) => {
                      state.shift();
                    });
                  } else if (record.id) {
                    remove({ appId: props.appId, id: record.id as string });
                  }
                }}
                okText={t('yes')}
                cancelText={t('no')}
              >
                <Button type='text' size='small' icon={<DeleteOutlined />} />
              </Popconfirm>
            )}
          </Space>
        ),
      },
    ];
  };

  const handleAddRecord = () => {
    setEditableRow(EDIT_ROW_KEY);
    setDataSource((state) => {
      state.unshift(InitRowData);
    });
  };

  const handleSave = (record: DynamicClass) => {
    if (!record.fullClassName) {
      setFullClassNameInputStatus('error');
      message.warning(t('appSetting.emptyFullClassName', { ns: 'components' }));
      return;
    }
    record.id === EDIT_ROW_KEY
      ? insert({ ...record, appId: props.appId, configType: 0 })
      : update({
          id: record.id,
          fullClassName: record.fullClassName,
          methodName: record.methodName,
          parameterTypes: record.parameterTypes,
        });
  };

  const { run: reload, loading } = useRequest(AppSettingService.queryRecordDynamicClassSetting, {
    defaultParams: [{ appId: props.appId }],
    onBefore() {
      setEditableRow(undefined);
    },
    onSuccess(res) {
      setDataSource(res || []);
    },
    loadingDelay: 100,
  });

  const { run: insert } = useRequest(AppSettingService.insertDynamicClassSetting, {
    manual: true,
    onSuccess(res) {
      res ? reload({ appId: props.appId }) : message.error(t('message.saveFailed'));
    },
    onError(e) {
      console.error(e);
      message.error(t('message.saveFailed'));
    },
  });

  const { run: update } = useRequest(AppSettingService.updateDynamicClassSetting, {
    manual: true,
    onSuccess(res) {
      res ? reload({ appId: props.appId }) : message.error(t('message.saveFailed'));
    },
    onError(e) {
      console.error(e);
      message.error(t('message.saveFailed'));
    },
  });

  const { run: remove } = useRequest(AppSettingService.removeDynamicClassSetting, {
    manual: true,
    onSuccess(res) {
      res ? reload({ appId: props.appId }) : message.error(t('message.delFailed'));
    },
    onError(e) {
      console.error(e);
      message.error(t('message.delFailed'));
    },
  });

  return (
    <div>
      <Table
        rowKey='id'
        size='small'
        loading={loading}
        dataSource={dataSource}
        columns={columns(setDataSource)}
        pagination={false}
      />

      <Button
        icon={<PlusOutlined />}
        disabled={!!editableRow}
        onClick={handleAddRecord}
        style={{ marginTop: '8px' }}
      >
        {t('add')}
      </Button>
    </div>
  );
};

export default DynamicClassesEditableTable;
