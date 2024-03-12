import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { PaneDrawer, SmallTextButton, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import type { TableColumnsType } from 'antd';
import { App, Input, InputRef, Table, theme } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { ReportService, StorageService } from '@/services';
import { AggOperation } from '@/services/ReportService';
import { DeleteRecordType } from '@/services/StorageService';

import RecordedCaseListDetail from './RecordedCaseDetail';

export type RecordedCaseRef = {
  open: () => void;
};

export type RecordedCaseProps = {
  appId: string;
  appName?: string;
  onChange?: () => void;
};

const RecordedCase = forwardRef<RecordedCaseRef, RecordedCaseProps>((props, ref) => {
  const { t } = useTranslation(['components']);
  const { token } = theme.useToken();
  const { message } = App.useApp();

  const [open, setOpen] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>();

  const searchInput = useRef<InputRef>(null);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  const {
    data: aggList = [],
    loading,
    refresh,
  } = useRequest(
    () =>
      ReportService.queryAggCount({
        appId: props.appId,
      }),
    {
      ready: open,
      onBefore() {
        setExpandedRowKeys(undefined);
      },
    },
  );

  const { run: deleteRecord } = useRequest(StorageService.deleteRecord, {
    manual: true,
    onSuccess(success) {
      if (success) {
        message.success(t('message.delSuccess', { ns: 'common' }));
        refresh();
        props.onChange?.();
      } else {
        message.error(t('message.delFailed', { ns: 'common' }));
      }
    },
  });

  const columns: TableColumnsType<AggOperation> = [
    {
      title: t('replay.operationName'),
      dataIndex: 'operationName',
      key: 'operationName',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input.Search
            allowClear
            enterButton
            size='small'
            ref={searchInput}
            placeholder={`${t('search', { ns: 'common' })} ${t('replay.api')}`}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onSearch={(value, event) => {
              // @ts-ignore
              if (event.target?.localName === 'input') return;
              confirm();
            }}
            onPressEnter={() => confirm()}
          />
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? token.colorPrimaryActive : undefined }} />
      ),
      onFilter: (value, record) =>
        record.operationName
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        visible && setTimeout(() => searchInput.current?.select(), 100);
      },
    },
    {
      title: t('replay.recordedCaseCount'),
      dataIndex: 'recordedCaseCount',
      key: 'recordedCaseCount',
      sorter: (a, b) => a.recordedCaseCount - b.recordedCaseCount,
      defaultSortOrder: 'descend',
    },
    {
      title: t('action', { ns: 'common' }),
      align: 'center',
      render: (value, { operationName }) => (
        <SmallTextButton
          size='small'
          icon={<DeleteOutlined />}
          title={t('delete', { ns: 'common' })}
          onClick={() => {
            deleteRecord({
              appId: props.appId,
              operationName,
              type: DeleteRecordType.ByAppIdAndOperationName,
            });
          }}
        />
      ),
    },
  ];

  return (
    <PaneDrawer
      destroyOnClose
      width='75%'
      title={t('replay.recordDetail')}
      footer={null}
      extra={
        <SmallTextButton
          danger
          title={t('deleteAll', { ns: 'common' })}
          icon={<DeleteOutlined />}
          onClick={() => {
            deleteRecord({
              appId: props.appId,
              type: DeleteRecordType.ByAppId,
            });
          }}
          style={{ marginRight: '8px' }}
        />
      }
      open={open}
      onClose={() => setOpen(false)}
    >
      <Table<AggOperation>
        size='small'
        rowKey='id'
        loading={loading}
        dataSource={aggList}
        columns={columns}
        expandable={{
          expandedRowKeys,
          expandedRowRender: (record) => (
            <RecordedCaseListDetail
              appId={record.appId}
              appName={props.appName}
              operationId={record.id}
              operationName={record.operationName}
              operationTypes={record.operationTypes}
              // onClick={() => setOpen(false)}
            />
          ),
          onExpand: (expanded, record) => setExpandedRowKeys(expanded ? [record.id] : undefined),
        }}
      />
    </PaneDrawer>
  );
});

export default RecordedCase;
