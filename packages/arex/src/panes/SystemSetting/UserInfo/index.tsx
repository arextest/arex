import { getLocalStorage, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Divider, Form, FormProps, Input } from 'antd';
import React, { FC, useEffect } from 'react';

import { EMAIL_KEY } from '@/constant';
import { LoginService } from '@/services';
import { UserProfile } from '@/services/UserService';
import { useUserProfile } from '@/store';

import AvatarUpload from './/AvatarUpload';

type UserInfoForm = Pick<UserProfile, 'avatar'> & {
  email: string;
};

const UserInfo: FC = () => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components']);
  const email = getLocalStorage<string>(EMAIL_KEY) as string;
  const { avatar, theme, compact, colorPrimary, language, getUserProfile } = useUserProfile();

  const [form] = Form.useForm<UserInfoForm>();

  useEffect(() => {
    form.setFieldsValue({
      avatar,
    });
  }, [avatar]);

  const { run: updateUserProfileRequestRun } = useRequest(LoginService.updateUserProfile, {
    manual: true,
    onSuccess(success) {
      success && getUserProfile();
    },
    onError(err) {
      message.error('Update profile failed');
      console.error(err);
    },
  });

  const handleFormChange: FormProps['onValuesChange'] = (values) => {
    const profile: UserProfile = {
      avatar: values.avatar,
      theme,
      compact,
      colorPrimary,
      language,
    };

    updateUserProfileRequestRun({
      profile: JSON.stringify(profile),
      userName: email,
    });
  };
  return (
    <>
      <Divider orientation='left'>{t('systemSetting.userInfo')} </Divider>

      <Form
        name='user-interface-form'
        form={form}
        initialValues={{
          email,
        }}
        onValuesChange={handleFormChange}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item label={t('email', { ns: 'common' })} name='email'>
          <Input readOnly variant='borderless' />
        </Form.Item>

        <Form.Item label={t('systemSetting.avatar')} name='avatar'>
          <AvatarUpload />
        </Form.Item>
      </Form>
    </>
  );
};

export default UserInfo;
