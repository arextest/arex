import { SpaceBetweenWrapper, useArexPaneProps, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Input, Modal, Typography } from 'antd';
import React, { FC, useState } from 'react';

import { ApplicationService } from '@/services';
import { useApplication, useMenusPanes } from '@/store';

interface DangerZoneProps {
  appId: string;
}

const DangerZone: FC<DangerZoneProps> = (props) => {
  const { t } = useTranslation(['components', 'common']);
  const { message } = App.useApp();
  const { paneKey } = useArexPaneProps();
  const { removePane } = useMenusPanes();
  const { setTimestamp } = useApplication();

  const [confirmAppIdValue, setConfirmAppIdValue] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [confirmInputStatus, setConfirmInputStatus] = useState<'error' | 'warning'>();

  const { run: deleteApplication } = useRequest(ApplicationService.deleteApplication, {
    manual: true,
    onSuccess: (success) => {
      if (success) {
        handleCancelDelete();
        removePane(paneKey);
        setTimestamp(Date.now());
        message.success(t('message.delSuccess', { ns: 'common' }));
      } else message.error(t('message.delFailed', { ns: 'common' }));
    },
  });

  function handleCancelDelete() {
    setConfirmDeleteOpen(false);
    setConfirmAppIdValue('');
    setConfirmInputStatus(undefined);
  }

  function handleConfirmDelete() {
    const valid = confirmAppIdValue.trim() === props.appId;
    if (valid) {
      deleteApplication({ appId: props.appId });
    } else {
      setConfirmInputStatus('error');
    }
  }

  function handleConfirmChange(e: React.ChangeEvent<HTMLInputElement>) {
    setConfirmAppIdValue(e.target.value);
    confirmInputStatus && setConfirmInputStatus(undefined);
  }

  return (
    <SpaceBetweenWrapper>
      <div>
        <Typography.Text strong style={{ display: 'block' }}>
          {t('appSetting.deleteThisApp')}
        </Typography.Text>
        <Typography.Text type='secondary'>{t('appSetting.deleteTip')}</Typography.Text>
      </div>

      <Button danger onClick={() => setConfirmDeleteOpen(true)}>
        {t('appSetting.deleteApp')}
      </Button>

      <Modal
        destroyOnClose
        open={confirmDeleteOpen}
        title={`${t('appSetting.confirmDelete')} ${props.appId}`}
        onCancel={handleCancelDelete}
        onOk={handleConfirmDelete}
      >
        <Typography.Text type='secondary'>{t('appSetting.deleteConfirmTip')}</Typography.Text>
        <Input
          value={confirmAppIdValue}
          placeholder={props.appId}
          status={confirmInputStatus}
          onChange={handleConfirmChange}
          style={{ marginTop: '8px' }}
        />
      </Modal>
    </SpaceBetweenWrapper>
  );
};

export default DangerZone;
