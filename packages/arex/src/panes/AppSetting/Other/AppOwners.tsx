import { useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Form, Select } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import { ApplicationService, UserService } from '@/services';

interface AppOwnersProps {
  appId: string;
  inline?: boolean;
  onAddOwner?: (owners: string[]) => void;
}

const AppOwners: FC<AppOwnersProps> = (props) => {
  const { inline = true, appId } = props;
  const { message } = App.useApp();
  const { t } = useTranslation();

  const [form] = Form.useForm<{ owners: string[] }>();

  useRequest(ApplicationService.getAppInfo, {
    defaultParams: [appId],
    onSuccess(res) {
      res.owners?.length && form.setFieldValue('owners', res.owners);
    },
  });

  const { run: overwriteAppOwners } = useRequest(
    (owners) =>
      ApplicationService.modifyApp({
        appId,
        owners,
      }),
    {
      manual: true,
      onSuccess(success: boolean, [owners]) {
        if (success) {
          owners && props.onAddOwner?.(owners);
          message.success(t('message.success'));
        } else {
          message.error(t('message.error'));
        }
      },
    },
  );
  const handleAddOwner = (values: { owners: string[] }) => {
    overwriteAppOwners(values.owners);
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

  const usersOptions = useMemo(
    () =>
      usersList?.map((user) => ({
        label: user.userName,
        value: user.userName,
      })),
    [usersList],
  );

  const [open, setOpen] = useState(false);
  const handleSearch = (value: string) => {
    setOpen(!!value);
    value && getUsersByKeyword(value);
  };

  return (
    <Form
      name={'ownerConfig' + props.appId}
      form={form}
      layout={inline ? 'inline' : undefined}
      onFinish={handleAddOwner}
      style={{ width: '100%' }}
    >
      <Form.Item label={t('appSetting.owners', { ns: 'components' })} name='owners'>
        <Select
          showSearch
          mode='multiple'
          open={open}
          placeholder={t('searchUsers')}
          options={usersOptions}
          onSearch={handleSearch}
          style={{ minWidth: '240px' }}
        />
      </Form.Item>

      <Form.Item style={{ textAlign: 'right' }}>
        <Button type='primary' htmlType='submit'>
          {t('save')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AppOwners;
