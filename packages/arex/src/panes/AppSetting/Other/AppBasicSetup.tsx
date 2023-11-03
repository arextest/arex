import { getLocalStorage, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Form, Input, Radio, Select } from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';

import { EMAIL_KEY } from '@/constant';
import { ApplicationService, UserService } from '@/services';
import { AppVisibilityLevel, CreateAppReq } from '@/services/ApplicationService';
import { useApplication } from '@/store';

interface AppBasicSetupProps {
  appId?: string; // undefined: create app; string: modify app
  hidden?: {
    appName?: boolean;
    owners?: boolean;
    visibilityLevel?: boolean;
  };
  onModify?: (owners: Partial<CreateAppReq>) => void;
  onCreate?: (appId: string) => void;
}

const AppBasicSetup: FC<AppBasicSetupProps> = (props) => {
  const { appId, hidden } = props;
  const { message } = App.useApp();
  const { t } = useTranslation('components');
  const { setTimestamp } = useApplication();
  const email = getLocalStorage<string>(EMAIL_KEY) as string;

  const [form] = Form.useForm<Partial<CreateAppReq>>();
  useEffect(() => {
    !appId && // init create app form
      form.setFieldsValue({
        owners: [email],
        visibilityLevel: 0,
      });
  }, []);

  useRequest(ApplicationService.getAppInfo, {
    ready: !!appId,
    defaultParams: [appId as string],
    onSuccess(res) {
      console.log(res);
      form.setFieldsValue({
        appName: res.appName,
        owners: res.owners ?? undefined, // set null to undefined
        visibilityLevel: res.visibilityLevel ?? 0,
      });
    },
  });

  const { run: createApp } = useRequest(ApplicationService.createApp, {
    manual: true,
    onSuccess(res) {
      if (res.success) {
        props.onCreate?.(res.appId);
        setOpen(false);
        setTimestamp(Date.now());
        message.success(
          t('message.createSuccess', {
            ns: 'common',
          }),
        );
      } else {
        message.error(
          t('message.createFailed', {
            ns: 'common',
          }),
        );
      }
    },
  });

  const { run: overwriteAppOwners } = useRequest(
    (params: Partial<CreateAppReq>) =>
      ApplicationService.modifyApp({
        appId: appId as string,
        ...params,
      }),
    {
      manual: true,
      ready: !!appId,
      onSuccess(success: boolean, [params]) {
        if (success) {
          setTimestamp(Date.now());
          success && props.onModify?.(params);
          message.success(t('message.success', { ns: 'common' }));
        } else {
          message.error(t('message.error', { ns: 'common' }));
        }
      },
    },
  );

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

  const handleSave = (values: Partial<CreateAppReq>) => {
    if (appId) {
      overwriteAppOwners(values);
    } else {
      createApp(values as CreateAppReq);
    }
  };

  return (
    <Form<Partial<CreateAppReq>>
      name={'ownerConfig' + props.appId}
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onFinish={handleSave}
    >
      <Form.Item
        name='appName'
        label={t('appSetting.appName')}
        hidden={hidden?.appName}
        rules={[
          {
            required: true,
            type: 'string',
            message: t('appSetting.appNameEmptyTip') as string,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name='owners'
        label={t('appSetting.owners', { ns: 'components' })}
        hidden={hidden?.owners}
      >
        <Select
          showSearch
          mode='multiple'
          open={open}
          placeholder={t('searchUsers', { ns: 'common' })}
          options={usersOptions}
          onSearch={handleSearch}
          onSelect={() => setOpen(false)}
          style={{ minWidth: '240px' }}
        />
      </Form.Item>

      <Form.Item
        name='visibilityLevel'
        label={t('appSetting.visibilityLevel')}
        hidden={hidden?.visibilityLevel}
      >
        <Radio.Group>
          <Radio value={AppVisibilityLevel.PUBLIC}>{t('appSetting.public')}</Radio>
          <Radio value={AppVisibilityLevel.PRIVATE}>{t('appSetting.private')}</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
        <Button type='primary' htmlType='submit'>
          {t('save', { ns: 'common' })}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AppBasicSetup;
