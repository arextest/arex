import { useTranslation } from '@arextest/arex-core';
import { usePagination } from 'ahooks';
import { Select, Table } from 'antd';
import dayjs from 'dayjs';
import { FC, useState } from 'react';

import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ReportService } from '@/services';

export type RecordedCaseListProps = {
  recordedCaseList: DataType;
  closeModal: () => void;
};

export type DataType = {
  id: string;
  operationName: string;
  recordedCaseCount: string;
  operationTypes: string[];
  appId: string;
};

const RecordedCaseListItem: FC<RecordedCaseListProps> = ({ recordedCaseList, closeModal }) => {
  const { appId, operationName, operationTypes } = recordedCaseList;
  const [operationType, setOperationType] = useState<string>(operationTypes[0]);
  const { t } = useTranslation(['components']);
  const options = operationTypes.map((type: string) => ({ text: type, value: type }));
  const navPane = useNavPane();
  const operationTypesChange = (type: string) => {
    setOperationType(type);
  };
  const columns = [
    {
      title: t('replay.recordId'),
      dataIndex: 'recordId',
      key: 'recordId',
      render: (text: string, record: { recordId: string }) => (
        <a
          onClick={() => {
            closeModal();
            navPane({ type: PanesType.CASE_DETAIL, id: record.recordId, data: record });
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: t('replay.recordTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD hh:mm:ss'),
    },
    {
      title: (
        <>
          {t('replay.operationType')}：
          <Select
            style={{ width: '100px' }}
            options={options}
            value={operationType}
            onChange={operationTypesChange}
          />
        </>
      ),
      dataIndex: 'operationType',
      key: 'operationType',
    },
  ];
  const {
    data: { list: listRecord } = { list: [] },
    pagination,
    loading,
  } = usePagination(
    (params) => {
      return ReportService.queryRecordList({
        appId: appId,
        beginTime: dayjs().startOf('day').valueOf(),
        endTime: dayjs().valueOf(),
        operationName: operationName,
        operationType: operationType,
        pageSize: params.pageSize,
        pageIndex: params.current,
      });
    },
    {
      refreshDeps: [operationType],
    },
  );

  return (
    <Table
      size='small'
      columns={columns}
      dataSource={listRecord}
      pagination={pagination}
      loading={loading}
      rowKey={'recordId'}
    />
  );
};

export default RecordedCaseListItem;
