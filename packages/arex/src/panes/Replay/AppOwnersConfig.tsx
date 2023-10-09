import { PaneDrawer, useTranslation } from '@arextest/arex-core';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import AppOwners from '@/panes/AppSetting/Other/AppOwners';

export type AppOwnerConfigProps = {
  appId: string;
  onClose?: () => void;
};

export type AppOwnerConfigRef = {
  open: () => void;
};

const AppOwnersConfig = forwardRef<AppOwnerConfigRef, AppOwnerConfigProps>((props, ref) => {
  const { t } = useTranslation('components');

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    props.onClose?.();
  };

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  return (
    <PaneDrawer title={t('replay.addOwner')} open={open} onClose={handleClose}>
      <AppOwners appId={props.appId} inline={false} />
    </PaneDrawer>
  );
});

export default AppOwnersConfig;
