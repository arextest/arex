import { useTranslation } from '@arextest/arex-core';
import { Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import AppBasicSetup from '@/panes/AppSetting/Other/AppBasicSetup';
import { CreateAppReq } from '@/services/ApplicationService';

export type AppOwnerConfigProps = {
  appId: string;
  onClose?: () => void;
  onAddOwner?: (owners: string[]) => void;
};

export type AppOwnerConfigRef = {
  open: () => void;
};

const AppOwnersConfig = forwardRef<AppOwnerConfigRef, AppOwnerConfigProps>((props, ref) => {
  const { t } = useTranslation('components');

  const [open, setOpen] = useState(false);

  const handleClose = (params?: Partial<CreateAppReq>) => {
    setOpen(false);
    props.onClose?.();
    Array.isArray(params?.owners) && props.onAddOwner?.(params!.owners);
  };

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  return (
    <Modal
      title={t('replay.addOwner')}
      footer={false}
      open={open}
      style={{ top: 160 }}
      onCancel={() => handleClose()}
    >
      <AppBasicSetup
        appId={props.appId}
        hidden={{ appName: true, visibilityLevel: true }}
        onModify={handleClose}
      />
    </Modal>
  );
});

export default AppOwnersConfig;
