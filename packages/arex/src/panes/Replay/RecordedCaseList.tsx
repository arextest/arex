import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import type { TableColumnsType } from 'antd';
import { Input, Modal, Table, theme } from 'antd';
import dayjs from 'dayjs';
import { forwardRef, useImperativeHandle, useState } from 'react';

import RecordedCaseListItem from '@/panes/Replay/RecordedCaseListItem';
import { ReportService } from '@/services';
export type RecordedCaseListRef = {
  open: () => void;
};

export type RecordedCaseListProps = {
  appId: string;
};

export type DataType = {
  id: string;
  operationName: string;
  recordedCaseCount: string;
  operationTypes: [];
  appId: string;
};

export type OjectType = {
  [key: string]: string;
};

const RecordedCaseList = forwardRef<RecordedCaseListRef, RecordedCaseListProps>((props, ref) => {
  const { t } = useTranslation(['components']);
  const [open, setOpen] = useState(false);
  const [curExpandedRowKeys, setCurExpandedRowKeys] = useState<string[]>([]);
  const { token } = theme.useToken();
  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));
  const { data: aggList, loading } = useRequest(
    () =>
      ReportService.queryAggCount({
        appId: props.appId,
        beginTime: dayjs().startOf('day').valueOf(),
        endTime: dayjs().valueOf(),
      }),
    {
      ready: open,
      onSuccess() {
        setCurExpandedRowKeys([]);
      },
    },
  );
  const columns: TableColumnsType<DataType> = [
    {
      title: t('replay.operationName'),
      dataIndex: 'operationName',
      key: 'operationName',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input.Search
            allowClear
            enterButton
            size='small'
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
    },
    {
      title: t('replay.recordedCaseCount'),
      dataIndex: 'recordedCaseCount',
      key: 'recordedCaseCount',
    },
  ];
  const expandedRowRender = (record: DataType) => {
    return (
      <RecordedCaseListItem
        recordedCaseList={record}
        closeModal={closeModal}
      ></RecordedCaseListItem>
    );
  };
  const onExpand = (expanded: boolean, record: DataType) => {
    if (expanded) {
      setCurExpandedRowKeys([record.id]);
    } else {
      setCurExpandedRowKeys([]);
    }
  };
  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      title={props.appId}
      width={'1000px'}
      footer={null}
      destroyOnClose={true}
      onCancel={() => setOpen(false)}
    >
      <Table
        size='small'
        columns={columns}
        expandable={{ expandedRowRender, onExpand, expandedRowKeys: curExpandedRowKeys }}
        dataSource={aggList as []}
        rowKey={'id'}
        loading={loading}
      />
    </Modal>
  );
});

export default RecordedCaseList;
