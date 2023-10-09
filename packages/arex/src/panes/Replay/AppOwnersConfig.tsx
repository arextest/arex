import { PaneDrawer, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Form, Select } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { ApplicationService, UserService } from '@/services';

export type AppOwnerConfigProps = {
  appId: string;
  onClose?: () => void;
};

export type AppOwnerConfigRef = {
  open: () => void;
};

const AppOwnersConfig = forwardRef<AppOwnerConfigRef, AppOwnerConfigProps>((props, ref) => {
  const { message } = App.useApp();
  const { t } = useTranslation('components');

  const [open, setOpen] = useState(false);

  const { run: overwriteAppOwners } = useRequest(
    (owners) =>
      ApplicationService.modifyApp({
        appId: props.appId,
        owners,
      }),
    {
      manual: true,
      onSuccess(success: boolean) {
        success
          ? message.success(t('message.success', { ns: 'common' }))
          : message.error(t('message.error', { ns: 'common' }));
      },
    },
  );
  const handleAddOwner = (values: { owners: string[] }) => {
    overwriteAppOwners(values.owners);
  };

  const handleClose = () => {
    setOpen(false);
    props.onClose?.();
  };

  const { data: usersList = [], run: getUsersByKeyword } = useRequest(
    UserService.getUsersByKeyword,
    {
      manual: true,
      debounceWait: 300,
      onSuccess(data) {
        console.log(data);
      },
    },
  );

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  return (
    <PaneDrawer title={t('replay.addOwner')} open={open} onClose={handleClose}>
      <Form name='ownerConfig' onFinish={handleAddOwner}>
        <Form.Item label={'Owners'} name='owners'>
          <Select
            showSearch
            mode='multiple'
            placeholder={'Search for users'}
            options={usersList?.map((user) => ({
              label: user.userName,
              value: user.userName,
            }))}
            onSearch={getUsersByKeyword}
          />
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

export default AppOwnersConfig;
