import { Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

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

  return (
    <Modal open={open} onCancel={() => setOpen(false)}>
      {props.appId}
    </Modal>
  );
});

export default RecordedCaseList;
