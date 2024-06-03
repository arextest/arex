import { DeleteOutlined } from '@ant-design/icons';
import { PaneDrawer, SmallTextButton, useTranslation } from '@arextest/arex-core';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { DeleteRecordType } from '@/services/StorageService';

import RecordedCase, { RecordedCaseProps, RecordedCaseRef } from './RecordedCase';

export type RecordedCaseDrawerRef = {
  open: () => void;
};

const RecordedCaseDrawer = forwardRef<RecordedCaseDrawerRef, RecordedCaseProps>((props, ref) => {
  const { t } = useTranslation(['components']);

  const [open, setOpen] = useState(false);

  const recordedCaseRef = useRef<RecordedCaseRef>(null);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

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
            recordedCaseRef.current?.delete({
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
      <RecordedCase ref={recordedCaseRef} appId={props.appId} appName={props.appName} />
    </PaneDrawer>
  );
});

export default RecordedCaseDrawer;
