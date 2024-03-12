import { getLocalStorage, useTranslation } from '@arextest/arex-core';
import { Divider, Form, Input } from 'antd';
import React, { FC, useEffect } from 'react';

import { EMAIL_KEY } from '@/constant';
import { UserProfile } from '@/services/UserService';
import { useUserProfile } from '@/store';

import AvatarUpload from './/AvatarUpload';

type UserInfoForm = Pick<UserProfile, 'avatar'> & {
  email: string;
};

const UserInfo: FC = () => {
  const { t } = useTranslation(['components']);
  const email = getLocalStorage<string>(EMAIL_KEY) as string;
  const { avatar } = useUserProfile();
  const [form] = Form.useForm<UserInfoForm>();

  useEffect(() => {
    form.setFieldsValue({
      avatar,
    });
  }, [avatar]);

  return (
    <>
      <Divider orientation='left'>{t('systemSetting.userInfo')} </Divider>

      <Form
        name='user-interface-form'
        form={form}
        initialValues={{
          email,
        }}
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
