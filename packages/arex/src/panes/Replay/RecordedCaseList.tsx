import { useRequest } from 'ahooks';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { ReportService } from '@/services';

export type RecordedCaseListRef = {
  open: () => void;
};

export type RecordedCaseListProps = {
  appId: string;
};

const RecordedCaseList = forwardRef<RecordedCaseListRef, RecordedCaseListProps>((props, ref) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  const { data: aggList } = useRequest(
    () =>
      ReportService.queryAggCount({
        appId: props.appId,
        beginTime: dayjs().startOf('day').valueOf(),
        endTime: dayjs().valueOf(),
      }),
    {
      ready: open,
      onSuccess(data) {
        console.log(data);
      },
    },
  );

  const { data: RecordList, run: queryRecordList } = useRequest(ReportService.queryRecordList, {
    manual: true,
    onSuccess(data) {
      console.log(data);
    },
  });

  return (
    <Modal open={open} title={props.appId} footer={null} onCancel={() => setOpen(false)}>
      {JSON.stringify(aggList)}
    </Modal>
  );
});

export default RecordedCaseList;
