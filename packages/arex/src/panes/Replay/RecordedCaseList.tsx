import { SearchOutlined } from '@ant-design/icons';
import { PaneDrawer, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import type { TableColumnsType } from 'antd';
import { Input, InputRef, Table, theme } from 'antd';
import dayjs from 'dayjs';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { ReportService } from '@/services';
import { AggOperation } from '@/services/ReportService';

import RecordedCaseListDetail from './RecordedCaseListDetail';

export type RecordedCaseListRef = {
  open: () => void;
};

export type RecordedCaseListProps = {
  appId: string;
};

const RecordedCaseList = forwardRef<RecordedCaseListRef, RecordedCaseListProps>((props, ref) => {
  const { t } = useTranslation(['components']);
  const { token } = theme.useToken();

  const [open, setOpen] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>();

  const searchInput = useRef<InputRef>(null);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  const { data: aggList = [], loading } = useRequest(
    () =>
      ReportService.queryAggCount({
        appId: props.appId,
        beginTime: dayjs().startOf('day').valueOf(),
        endTime: dayjs().valueOf(),
      }),
    {
      ready: open,
      onBefore() {
        setExpandedRowKeys(undefined);
      },
    },
  );

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
  ];

  return (
    <PaneDrawer
      destroyOnClose
      width='75%'
      title={props.appId}
      footer={null}
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
              operationName={record.operationName}
              operationTypes={record.operationTypes}
              onClick={() => setOpen(false)}
            />
          ),
          onExpand: (expanded, record) => setExpandedRowKeys(expanded ? [record.id] : undefined),
        }}
      />
    </PaneDrawer>
  );
});

export default RecordedCaseList;
