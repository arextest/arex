import { PaneDrawer, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Form, Select } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

export type AppOwnerConfigProps = {
  appId: string;
  onClose?: () => void;
};

export type AppOwnerConfigRef = {
  open: () => void;
};

const AppOwnerConfig = forwardRef<AppOwnerConfigRef, AppOwnerConfigProps>((props, ref) => {
  const { message } = App.useApp();
  const { t } = useTranslation('components');
  const [open, setOpen] = useState(false);

  const { run: addAppOwners } = useRequest(() => Promise.resolve(true), {
    manual: true,
    onSuccess(success: boolean) {
      success
        ? message.success(t('message.success', { ns: 'common' }))
        : message.error(t('message.error', { ns: 'common' }));
    },
  });
  const handleAddOwner = (values: { owners: string[] }) => {
    addAppOwners();
  };

  const handleClose = () => {
    setOpen(false);
    props.onClose?.();
  };

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  return (
    <PaneDrawer title={t('replay.addOwner')} open={open} onClose={handleClose}>
      {props.appId}

      <Form name='ownerConfig' onFinish={handleAddOwner}>
        <Form.Item label={'Owners'} name='owners'>
          <Select showSearch mode='multiple' placeholder={'Search for users'} />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginTop: '16px' }}>
          <Button type='primary' htmlType='submit'>
            {t('save', { ns: 'common' })}
          </Button>
        </Form.Item>
      </Form>
    </PaneDrawer>
  );
});

export default AppOwnerConfig;
