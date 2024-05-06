import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { SmallTextButton, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { type TableColumnsType, App, Input, InputRef, Table, theme } from 'antd';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { ReportService, StorageService } from '@/services';
import { AggOperation } from '@/services/ReportService';
import { DeleteRecordReq, DeleteRecordType } from '@/services/StorageService';
import { decodePaneKey } from '@/store/useMenusPanes';

import RecordedCaseListDetail from './RecordedCaseDetail';

export type RecordedCaseProps = {
  paneKey?: string;
  appId?: string;
  appName?: string;
  onChange?: () => void;
};

export type RecordedCaseRef = {
  delete: (params: DeleteRecordReq) => void;
};
const RecordedCase = forwardRef<RecordedCaseRef, RecordedCaseProps>((props, ref) => {
  const { t } = useTranslation(['components']);
  const { token } = theme.useToken();
  const { message } = App.useApp();

  const appId = useMemo(
    () => props.appId || decodePaneKey(props.paneKey).id,
    [props.appId, props.paneKey],
  );

  const searchInput = useRef<InputRef>(null);

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>();

  const {
    data: aggList = [],
    loading,
    refresh,
  } = useRequest(
    () =>
      ReportService.queryAggCount({
        appId,
      }),
    {
      // ready: open,
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

  useImperativeHandle(ref, () => ({
    delete: deleteRecord,
  }));

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
      // sorter: (a, b) => a.recordedCaseCount - b.recordedCaseCount,
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
              appId,
              operationName,
              type: DeleteRecordType.ByAppIdAndOperationName,
            });
          }}
        />
      ),
    },
  ];

  return (
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
  );
});

export default RecordedCase;
