import { useRequest } from 'ahooks';
import { Modal, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { forwardRef, useImperativeHandle, useState } from 'react';
import RecordedCaseListItem from '@/panes/Replay/RecordedCaseListItem';
import { ReportService } from '@/services';
import { useTranslation } from 'arex-core';

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
    },
  );
  const columns: TableColumnsType<DataType> = [
    { title: t('replay.operationName'), dataIndex: 'operationName', key: 'operationName' },
    {
      title: t('replay.recordedCaseCount'),
      dataIndex: 'recordedCaseCount',
      key: 'recordedCaseCount',
    },
  ];
  const expandedRowRender = (record: DataType) => {
    return <RecordedCaseListItem recordedCaseList={record}></RecordedCaseListItem>;
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
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={aggList as []}
        rowKey={'id'}
        pagination={false}
        loading={loading}
      />
    </Modal>
  );
});

export default RecordedCaseList;
