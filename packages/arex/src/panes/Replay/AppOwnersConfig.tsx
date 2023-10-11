import { useTranslation } from '@arextest/arex-core';
import { Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import AppOwners from '@/panes/AppSetting/Other/AppOwners';

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

  const handleClose = (owners?: string[]) => {
    setOpen(false);
    props.onClose?.();
    Array.isArray(owners) && props.onAddOwner?.(owners);
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
      <AppOwners appId={props.appId} inline={false} onAddOwner={handleClose} />
    </Modal>
  );
});

export default AppOwnersConfig;
