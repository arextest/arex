import { useTranslation } from '@arextest/arex-core';
import { usePagination } from 'ahooks';
import { Select, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { FC, useMemo, useState } from 'react';

import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ReportService } from '@/services';
import { AggOperation, RecordType } from '@/services/ReportService';

export type RecordedCaseListProps = {
  appName?: string;
  operationId: string;
  onClick?: () => void;
} & Pick<AggOperation, 'appId' | 'operationName' | 'operationTypes'>;

const RecordedCaseListItem: FC<RecordedCaseListProps> = (props) => {
  const navPane = useNavPane();
  const { t } = useTranslation(['components']);

  const [operationType, setOperationType] = useState<string>(props.operationTypes?.[0]);

  const options = useMemo(
    () => props.operationTypes?.map((type: string) => ({ text: type, value: type })),
    [props.operationTypes],
  );

  const columns: ColumnsType<RecordType> = [
    {
      title: t('replay.recordId'),
      dataIndex: 'recordId',
      key: 'recordId',
      render: (recordId, record) => (
        <a
          onClick={() => {
            props.onClick?.();
            navPane({
              type: PanesType.CASE_DETAIL,
              id: record.recordId,
              data: {
                appId: props.appId,
                recordId: record.recordId,
                appName: props.appName,
                operationName: props.operationName,
                operationId: props.operationId,
              },
            });
          }}
        >
          {recordId}
        </a>
      ),
    },
    {
      title: t('replay.recordTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (createTime) => dayjs(createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      key: 'operationType',
      dataIndex: 'operationType',
      title: (
        <>
          {t('replay.operationType')}：
          <Select
            size='small'
            style={{ width: '100px' }}
            options={options}
            value={operationType}
            onChange={setOperationType}
          />
        </>
      ),
    },
  ];

  const {
    data: { list: listRecord } = { list: [] },
    pagination,
    loading,
  } = usePagination(
    (params) => {
      return ReportService.queryRecordList({
        appId: props.appId,
        operationName: props.operationName,
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
    <Table<RecordType>
      size='small'
      rowKey='recordId'
      columns={columns}
      dataSource={listRecord}
      pagination={pagination}
      loading={loading}
    />
  );
};

export default RecordedCaseListItem;
