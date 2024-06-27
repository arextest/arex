import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { HelpTooltip, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Checkbox, Input, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Updater, useImmer } from 'use-immer';

import { ConfigService } from '@/services';
import { DynamicClass } from '@/services/ConfigService';
import { focusNewLineInput } from '@/utils/table';

export type DynamicClassesEditableTableProps = {
  appId: string;
};

export type DynamicClassesEditableTableRef = {
  save: () => void;
};

const EDIT_ROW_KEY = '__edit_row__';
const generateInitRowData = () => ({
  id: EDIT_ROW_KEY + (Math.random() * 10e12).toFixed(),
  fullClassName: '',
  methodName: '',
  keyFormula: '',
  parameterTypes: '',
});

const hiddenAc = (text: string) => (text.startsWith('ac:') ? text.substring(3) : text);

const DynamicClassesEditableTable = forwardRef<
  DynamicClassesEditableTableRef,
  DynamicClassesEditableTableProps
>((props, ref) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['common', 'components']);

  const [fullClassNameInputStatus, setFullClassNameInputStatus] = useState<
    '' | 'error' | 'warning'
  >('');

  const tableRef = useRef<HTMLDivElement>(null);
  const [dataSource, setDataSource] = useImmer<DynamicClass[]>([]);

  const columns = (paramsUpdater: Updater<DynamicClass[]>): ColumnsType<DynamicClass> => {
    const handleChange = (id: string, attr: keyof DynamicClass, value: string | boolean) => {
      paramsUpdater((draft) => {
        const index = draft.findIndex((item) => item.id === id);
        draft[index] = { ...draft[index], [attr]: value };
      });
    };

    return [
      {
        title: (
          <HelpTooltip
            maxWidth='320px'
            title={
              <div style={{ whiteSpace: 'pre-line' }}>
                {t('appSetting.fullClassNameTooltip', { ns: 'components' })}
              </div>
            }
          >
            {t('appSetting.fullClassName', { ns: 'components' })}
          </HelpTooltip>
        ),
        dataIndex: 'fullClassName',
        key: 'fullClassName',
        render: (text, record) => (
          <Input
            value={hiddenAc(text)}
            status={fullClassNameInputStatus}
            onChange={(e) => {
              setFullClassNameInputStatus('');
              handleChange(record.id, 'fullClassName', e.target.value);
            }}
            style={{ borderColor: 'transparent' }}
          />
        ),
      },
      {
        title: (
          <HelpTooltip title={t('appSetting.baseTooltip', { ns: 'components' })}>
            {t('appSetting.base', { ns: 'components' })}
          </HelpTooltip>
        ),
        key: 'base',
        dataIndex: 'base',
        align: 'center',
        render: (checked, record) => (
          <Checkbox
            checked={checked}
            onChange={(e) => handleChange(record.id, 'base', e.target.checked)}
          />
        ),
      },
      {
        title: (
          <HelpTooltip title={t('appSetting.methodNameTooltip', { ns: 'components' })}>
            {t('appSetting.methodName', { ns: 'components' })}
          </HelpTooltip>
        ),
        dataIndex: 'methodName',
        key: 'methodName',
        render: (text, record) => (
          <Input
            value={text}
            onChange={(e) => handleChange(record.id, 'methodName', e.target.value)}
            style={{ borderColor: 'transparent' }}
          />
        ),
      },
      {
        title: (
          <HelpTooltip
            maxWidth='224px'
            title={t('appSetting.parameterTypesTooltip', { ns: 'components' })}
          >
            {t('appSetting.parameterTypes', { ns: 'components' })}
          </HelpTooltip>
        ),
        dataIndex: 'parameterTypes',
        key: 'parameterTypes',
        render: (text, record) => (
          <Input
            value={text}
            onChange={(e) => handleChange(record.id, 'parameterTypes', e.target.value)}
            style={{ borderColor: 'transparent' }}
          />
        ),
      },
      {
        title: (
          <HelpTooltip
            title={
              <>
                {t('appSetting.keyFormulaTooltip', { ns: 'components' })}{' '}
                <a
                  href='https://docs.spring.io/spring-framework/reference/core/expressions.html'
                  target='_blank'
                  rel='noreferrer'
                >
                  SpEL
                </a>
              </>
            }
          >
            {t('appSetting.keyFormula', { ns: 'components' })}
          </HelpTooltip>
        ),
        dataIndex: 'keyFormula',
        key: 'keyFormula',
        render: (text, record) => (
          <Input
            value={text}
            onChange={(e) => handleChange(record.id, 'keyFormula', e.target.value)}
            style={{ borderColor: 'transparent' }}
          />
        ),
      },
      {
        title: t('action'),
        key: 'actions',
        width: 72,
        align: 'center',
        className: 'actions',
        render: (text, record) => (
          <Button
            danger
            type='link'
            size='small'
            icon={<DeleteOutlined />}
            onClick={() => setDataSource((state) => state.filter((item) => item.id !== record.id))}
          >
            {t('replay.delete', { ns: 'components' })}
          </Button>
        ),
      },
    ];
  };

  const handleAddRecord = () => {
    setDataSource((state) => {
      state.push(generateInitRowData());
    });
    focusNewLineInput(tableRef);
  };

  const handleSave = () => {
    // verify fullClassName
    // if (!record.fullClassName) {
    //   setFullClassNameInputStatus('error');
    //   message.warning(t('appSetting.emptyFullClassName', { ns: 'components' }));
    //   return;
    // }

    const params = dataSource.map((data) => ({
      id: data.id.startsWith(EDIT_ROW_KEY) ? undefined : data.id,
      appId: props.appId,
      fullClassName: (data.base ? 'ac:' : '') + hiddenAc(data.fullClassName),
      methodName: data.methodName,
      keyFormula: data.keyFormula,
      parameterTypes: data.parameterTypes,
    }));

    replace(props.appId, params);
  };

  useImperativeHandle(ref, () => ({ save: handleSave }), [handleSave]);

  const { refresh: reload, loading } = useRequest(ConfigService.queryDynamicClass, {
    defaultParams: [{ appId: props.appId }],
    onSuccess(res) {
      setDataSource(res || []);
    },
    loadingDelay: 100,
  });

  const { run: replace } = useRequest(ConfigService.replaceDynamicClass, {
    manual: true,
    onError(e) {
      console.error(e);
      message.error(t('message.saveFailed'));
      reload();
    },
  });

  return (
    <Table
      // @ts-ignore
      ref={tableRef}
      rowKey='id'
      size='small'
      loading={loading}
      dataSource={dataSource}
      columns={columns(setDataSource)}
      footer={() => (
        <Button block type='text' icon={<PlusOutlined />} onClick={handleAddRecord}>
          {t('add')}
        </Button>
      )}
      pagination={false}
    />
  );
});

export default DynamicClassesEditableTable;
